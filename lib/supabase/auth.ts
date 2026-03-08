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

/**
 * Get authenticated admin user - throws redirect if not authenticated or not admin
 * Use this in admin layout and admin pages
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return { user, supabase };
}

