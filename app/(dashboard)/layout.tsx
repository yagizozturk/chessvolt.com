import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VoltExplainDialog } from "@/components/volt-explain-dialog/volt-explain-dialog";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider open={false}>
      <AppSidebar />
      {/* 
        Note:
        overflow-auto keeps the sidebar fixed while content is scrollable. 
        Shadcn standart is like that. no position-fixed for the sidebar. TODO: Check Shadcn
      */}
      <SidebarInset className="overflow-auto">
        <header className="flex h-12 shrink-0 items-center px-4 md:hidden">
          <SidebarTrigger className="-ml-1" />
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
