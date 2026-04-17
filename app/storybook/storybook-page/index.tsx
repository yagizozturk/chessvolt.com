"use client";

import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StorybookSidebar } from "../components/storybook-sidebar";

type StorybookPageProps = {
  children: ReactNode;
};

export default function StorybookPage({ children }: StorybookPageProps) {
  return (
    <SidebarProvider>
      <StorybookSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
