import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAuthenticatedUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNavbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
