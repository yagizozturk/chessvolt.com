import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { VoltExplainDialog } from "@/components/volt-explain-dialog/volt-explain-dialog";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider open={false}>
      <AppSidebar />
      <SidebarInset className="overflow-auto">{children}</SidebarInset>
      {/* Single dialog instance for the whole dashboard — opened by auto-start
          (collection first visit) or by sidebar "How Volt Works" (any time). */}
      <VoltExplainDialog />
    </SidebarProvider>
  );
}
