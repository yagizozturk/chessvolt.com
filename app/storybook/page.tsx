import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { StorybookSidebar } from "./components/storybook-sidebar";

type StorybookPageProps = {
  children: ReactNode;
};

export function StorybookPage({ children }: StorybookPageProps) {
  return (
    <SidebarProvider>
      <StorybookSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function StorybookHomePage() {
  redirect("/storybook/buttons");
}
