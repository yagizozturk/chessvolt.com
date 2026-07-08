// TODO: Refactor
import type { ContactMessage } from "@/features/contact/types/contact-message";

export type DbContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  user_id: string | null;
  created_at: string;
};

export function toContactMessage(db: DbContactMessage): ContactMessage {
  return {
    id: db.id,
    name: db.name,
    email: db.email,
    subject: db.subject,
    message: db.message,
    userId: db.user_id,
    createdAt: db.created_at,
  };
}
