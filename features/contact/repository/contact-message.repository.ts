/**
 * Contact Message Repository
 *
 * Responsibility: CRUD access to the contact_messages table.
 */

import {
  toContactMessage,
  type DbContactMessage,
} from "@/features/contact/mapper/contact-message.mapper";
import type { ContactMessage, CreateContactMessageInput } from "@/features/contact/types/contact-message";
import { postgrestUserMessage } from "@/lib/supabase/postgrest-user-message";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function create(
  supabase: SupabaseClient,
  input: CreateContactMessageInput,
): Promise<{ message: ContactMessage | null; error: string | null }> {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      name: input.name,
      email: input.email,
      subject: input.subject ?? null,
      message: input.message,
      user_id: input.userId ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("contact-message.repository.create error:", error);
    return { message: null, error: postgrestUserMessage(error) };
  }

  return { message: toContactMessage(data as DbContactMessage), error: null };
}
