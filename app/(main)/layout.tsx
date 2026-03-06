import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAuthenticatedUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1147] to-[#0f0a28]">
      {children}
    </div>
  );
}
