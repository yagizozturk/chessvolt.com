/**
 * Server-side authentication utilities
 * For use in Server Components and Server Actions
 */

import { redirect } from 'next/navigation';
import { createClient } from './server';

/**
 * Get authenticated user - throws redirect if not authenticated
 * Use this in Server Components that are already protected by layout
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return { user, supabase };
}

