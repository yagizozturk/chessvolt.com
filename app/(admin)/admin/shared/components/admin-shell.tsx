"use client";

import { AdminAppSidebar } from "@/app/(admin)/admin/shared/components/sidebar/admin-app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type Props = {
  userEmail: string;
  children: React.ReactNode;
};

export function AdminShell({ userEmail, children }: Props) {
  return (
    <SidebarProvider>
      <AdminAppSidebar userEmail={userEmail} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <span className="text-muted-foreground text-sm font-medium">Admin</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
