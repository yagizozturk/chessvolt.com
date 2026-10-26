import { CustomBreadcrumb } from "@/components/custom-breadcrumb/custom-breadcrumb";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VoltExplainDialog } from "@/components/volt-explain-dialog/volt-explain-dialog";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      {/* 
        Note:
        overflow-auto keeps the sidebar fixed while content is scrollable. 
        Shadcn standart is like that. no position-fixed for the sidebar. TODO: Check Shadcn
      */}
      <SidebarInset className="overflow-auto">
        <header className="flex h-12 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <CustomBreadcrumb />
          </div>
        </header>
        {children}
      </SidebarInset>
      {/*
        Note: Volt Explain Dialog 
        Single dialog instance for the whole dashboard — opened by auto-start
        (study first visit after onboarding) or by sidebar "How Volt Works" (any time). 
      */}
      <VoltExplainDialog />
    </SidebarProvider>
  );
}
