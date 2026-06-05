export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  userId: string | null;
  createdAt: string;
};

export type CreateContactMessageInput = {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  userId?: string | null;
};
