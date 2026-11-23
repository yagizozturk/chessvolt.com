/**
 * API Route Handler Utilities
 * Common patterns for API routes: auth, validation, error handling
 */
import { type SupabaseClient, type User, createClient as createSupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// ============================================================================
// Types
// ============================================================================

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type AuthenticatedRequest = {
  user: User;
  /** Runs queries as `user` (cookie session or Bearer token), so RLS applies. */
  supabase: SupabaseClient;
};

export type OptionalAuthRequest = {
  user: User | null;
  /** User-scoped client when signed in, otherwise an anonymous client. */
  supabase: SupabaseClient;
};

// ============================================================================
// Response Helpers
// ============================================================================

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status },
  );
}

export function errorResponse(error: string, status = 500): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status },
  );
}

// ============================================================================
// Request Helpers
// ============================================================================

/**
 * Parse a JSON object body. Invalid JSON, arrays and primitives become `{}`,
 * so the route's field checks answer with 400 instead of throwing.
 */
export async function readJsonBody(req: Request): Promise<Record<string, unknown>> {
  const body: unknown = await req.json().catch(() => null);
  return body !== null && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
}

// ============================================================================
// Auth Helper
// ============================================================================

const BEARER_TOKEN_PATTERN = /^Bearer\s+(\S+)\s*$/i;

function getBearerToken(authorization: string | null): string | null {
  return authorization?.match(BEARER_TOKEN_PATTERN)?.[1] ?? null;
}

/**
 * Stateless client for Bearer requests (mobile app). With an access token every
 * query runs as that user, so RLS behaves exactly like the cookie-based client.
 */
function createTokenClient(accessToken?: string): SupabaseClient {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    ...(accessToken ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } } : {}),
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Resolve the caller without requiring a session.
 * - `Authorization: Bearer <supabase access_token>` header (mobile): the token is verified with Supabase Auth.
 *   An invalid or expired token never falls back to cookies; the caller is treated as signed out.
 * - Otherwise the Supabase session cookies are used (web), exactly as before.
 */
export async function getOptionalAuth(): Promise<OptionalAuthRequest> {
  const accessToken = getBearerToken((await headers()).get("authorization"));

  if (accessToken) {
    const supabase = createTokenClient(accessToken);
    const {
      data: { user },
    } = await supabase.auth.getUser(accessToken);

    return user ? { user, supabase } : { user: null, supabase: createTokenClient() };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, supabase };
}

/**
 * Get authenticated user and supabase client
 * Returns null if user is not authenticated
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedRequest | null> {
  const { user, supabase } = await getOptionalAuth();

  if (!user) {
    return null;
  }

  return { user, supabase };
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedRequest> {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    throw new Error("Unauthorized");
  }

  return auth;
}

// ============================================================================
// Error Handler Wrapper
// ============================================================================

export function withErrorHandler<T extends unknown[]>(handler: (...args: T) => Promise<NextResponse>) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      const status = errorMessage === "Unauthorized" ? 401 : 500;

      console.error("API route error:", error);
      return errorResponse(errorMessage, status);
    }
  };
}
