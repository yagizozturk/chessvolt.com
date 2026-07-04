import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { VoltExplainDialog } from "@/components/volt-explain-dialog/volt-explain-dialog";
import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { supabase } = await getPublicUser();
  const openings = await getAllOpenings(supabase);

  return (
    <SidebarProvider open={false}>
      <AppSidebar openings={openings} />
      {/* 
        Note:
        overflow-auto keeps the sidebar fixed while content is scrollable. 
        Shadcn standart is like that. no position-fixed for the sidebar. TODO: Check Shadcn
      */}
      <SidebarInset className="overflow-auto">{children}</SidebarInset>
      {/*
        Note: Volt Explain Dialog 
        Single dialog instance for the whole dashboard — opened by auto-start
        (user-collection first visit after onboarding) or by sidebar "How Volt Works" (any time). 
      */}
      <VoltExplainDialog />
    </SidebarProvider>
  );
}
