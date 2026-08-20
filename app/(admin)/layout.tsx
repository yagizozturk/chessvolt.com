import { AdminShell } from "@/app/(admin)/admin/shared/components/admin-shell";
import { getAdminUser } from "@/lib/supabase/auth";
import { Metadata } from 'next';

// Prevent indexing of admin pages by search engines
export const metadata: Metadata = {
  title: "Admin Panel",
  robots: {
    index: false,
    follow: false, 
    nocache: true,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAdminUser();

  return (
    <div className="bg-background flex min-h-svh w-full">
      <AdminShell userEmail={user.email ?? "admin@chessvolt.com"}>{children}</AdminShell>
    </div>
  );
}
