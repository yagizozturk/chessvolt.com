import { DashboardNavbar } from "@/features/home/components/dashboard-navbar";

/**
 * min-h-screen (açılımı: min-height: 100vh;) demektir.
 * Ana kapsayıcının yüksekliğinin en az ekranın yüksekliği kadar olmasını sağlar.
 * Tüm sayfa dolu olsun isteriz.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <DashboardNavbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
