import { DashboardNavbar } from "@/features/home/components/dashboard-navbar";
import * as profileRepo from "@/features/profile/repository/profile.repository";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, supabase } = await getAuthenticatedUser();
  await profileRepo.ensureProfileExists(supabase, user);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <DashboardNavbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
