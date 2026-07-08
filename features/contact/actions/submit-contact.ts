"use server";

import { submitContactMessage } from "@/features/contact/services/contact-message.service";
import { getPublicUser } from "@/lib/supabase/auth";
import { isValidEmail } from "@/lib/utils/validation";

export type SubmitContactResult = { success: true } | { success: false; error: string };

export async function submitContactAction(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<SubmitContactResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  const subject = input.subject?.trim() ?? "";
  const message = input.message.trim();

  if (!name) {
    return { success: false, error: "Name is required." };
  }

  if (!email) {
    return { success: false, error: "Email is required." };
  }

  if (!isValidEmail(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!message) {
    return { success: false, error: "Message is required." };
  }

  if (message.length > 5000) {
    return { success: false, error: "Message must be 5,000 characters or fewer." };
  }

  const { user, supabase } = await getPublicUser();

  const { error } = await submitContactMessage(supabase, {
    name,
    email,
    subject: subject || null,
    message,
    userId: user?.id ?? null,
  });

  if (error) {
    return { success: false, error };
  }

  return { success: true };
}
