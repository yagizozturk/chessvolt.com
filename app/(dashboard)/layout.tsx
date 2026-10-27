import { CustomBreadcrumb } from "@/components/custom-breadcrumb/custom-breadcrumb";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VoltExplainDialog } from "@/components/volt-explain-dialog/volt-explain-dialog";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      {/* ====== İçerik alanı. overflow-auto içerik taştığında kaydırmayı yönetir. İçerik boyuttan daha büüyk olursa scroll koyarak kaydırma sağlar ====== */}
      <SidebarInset className="overflow-auto">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-8" />
            <CustomBreadcrumb />
          </div>
        </header>
        {children}
      </SidebarInset>
      {/* ====== Volt anlatımı. Onboarding sonrası ilk ziyarette açılır ====== */}
      <VoltExplainDialog />
    </SidebarProvider>
  );
}
