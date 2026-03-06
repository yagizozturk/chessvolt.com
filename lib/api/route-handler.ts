/**
 * API Route Handler Utilities
 * Common patterns for API routes: auth, validation, error handling
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================================
// Types
// ============================================================================

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type AuthenticatedRequest = {
  user: { id: string; email?: string };
  supabase: Awaited<ReturnType<typeof createClient>>;
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
    { status }
  );
}

export function errorResponse(
  error: string,
  status = 500
): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status }
  );
}

// ============================================================================
// Auth Helper
// ============================================================================

/**
 * Get authenticated user and supabase client
 * Returns null if user is not authenticated
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedRequest | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    supabase,
  };
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedRequest> {
  const auth = await getAuthenticatedUser();
  
  if (!auth) {
    throw new Error('Unauthorized');
  }
  
  return auth;
}

// ============================================================================
// Error Handler Wrapper
// ============================================================================

export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      const status = errorMessage === 'Unauthorized' ? 401 : 500;
      
      console.error('API route error:', error);
      return errorResponse(errorMessage, status);
    }
  };
}

