// TODO: Refactor
/**
 * Contact Message Service
 *
 * Responsibility: Business logic for contact_messages rows.
 */

import * as contactMessageRepo from "@/features/contact/repository/contact-message.repository";
import type { ContactMessage, CreateContactMessageInput } from "@/features/contact/types/contact-message";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function submitContactMessage(
  supabase: SupabaseClient,
  input: CreateContactMessageInput,
): Promise<{ message: ContactMessage | null; error: string | null }> {
  return contactMessageRepo.create(supabase, input);
}
