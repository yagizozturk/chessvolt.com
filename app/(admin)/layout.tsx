import { getAdminUser } from "@/lib/supabase/auth";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAdminUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminNavbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
