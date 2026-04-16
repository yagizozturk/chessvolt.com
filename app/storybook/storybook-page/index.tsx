"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { BadgesShowcase } from "../components/badges/badges-showcase";
import { ButtonShowcase } from "../components/buttons/button-showcase";
import { CardsShowcase } from "../components/cards/cards-showcase";
import { ColorsShowcase } from "../components/colors/colors-showcase";
import { StorybookSidebar } from "../components/storybook-sidebar";

export default function StorybookPage() {
  return (
    <SidebarProvider>
      <StorybookSidebar />
      <SidebarInset>
        <main className="flex-1 space-y-10 overflow-auto p-6">
          <ButtonShowcase />
          <Separator />
          <BadgesShowcase />
          <Separator />
          <CardsShowcase />
          <Separator />
          <ColorsShowcase />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
