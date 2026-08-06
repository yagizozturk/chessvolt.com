import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

import { POST_LOGIN_URL } from "@/features/onboarding/constants/onboarding-routes";
import * as profileRepo from "@/features/profile/repository/profile.repository";

// ======================================================================
// That is a OAuth / email-link handler page for Supabase
// Redirects the user after login, signup, Google OAuth, a pass-reset
// email, it lands here with a code in the URL. Code is auth token. Saved in cookies.
// next: parameter of the URL to send user after success.
// ======================================================================
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || POST_LOGIN_URL;

  if (code) {
    const cookieStore = await cookies();

    // ======================================================================
    // Creating a Supabase server client + Create Cookie Hooks
    // ======================================================================
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          // Only registering the callback with setAll. This will execute when exchangeCodeForSession executes
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {
              // Ignore errors
            }
          },
        },
      },
    );

    // ======================================================================
    // Using client created above, Supabase, for a real session
    // Returns { data, error } (session + user). Supabase builds cookiesToSet internally
    // Supabase calls setAll(cookiesToSet) → cookies saved
    // ======================================================================
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      // Ensuring profile exists in PROFILES(own DB) table, not Supabase(it is already created)
      // TODO: last_login_at can be added to DB table later.
      await profileRepo.ensureProfileExists(supabase, user);
    }
  }

  // ======================================================================
  // Redirecting the user to the next page
  // ======================================================================
  return NextResponse.redirect(new URL(next, request.url));
}
