import { getAdminUser } from "@/lib/supabase/auth";
import { AdminNavbar } from "@/features/admin/components/admin-navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAdminUser();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AdminNavbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
