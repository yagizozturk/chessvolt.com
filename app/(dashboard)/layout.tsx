import { DashboardNavbar } from "@/features/home/components/dashboard-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-svh flex-col">
      <DashboardNavbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
