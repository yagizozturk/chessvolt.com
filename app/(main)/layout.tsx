import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAuthenticatedUser();

  return <div className="min-h-screen bg-background">{children}</div>;
}
