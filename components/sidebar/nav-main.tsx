"use client";

import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

// Submenu items are either navigation links or runtime actions.
// TypeScript union: an item has `url` OR `onClick`, never both — avoids fake "#" links for actions.
export type NavSubItem =
  | { title: string; url: string; onClick?: never }
  | { title: string; onClick: () => void | Promise<void>; url?: never };

export type NavMainItem = {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: NavSubItem[];
};

export function NavMain({ items }: { items: NavMainItem[] }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-3 group-data-[collapsible=icon]:items-center">
        {items.map((item) => (
          <DropdownMenu key={item.title}>
            <SidebarMenuItem>
              <DropdownMenuTrigger asChild>
                {/* data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-10 */}
                {/* When the sidebar is in collapsed icon mode, each nav button becomes 40×40px (size-10) */}
                {/* !size-10 — overrides shadcn’s default size-8 (32px) on menu buttons in icon mode */}
                {/* Gives your larger size-6 icons more room in the 4rem rail. */}
                <SidebarMenuButton
                  tooltip={item.title}
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:justify-center focus-visible:ring-0"
                >
                  {item.icon ? (
                    <Image src={item.icon} alt="" aria-hidden width={32} height={32} className="size-8 shrink-0" />
                  ) : null}
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  <MoreHorizontalIcon className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              {item.items?.length ? (
                <DropdownMenuContent
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                  className="min-w-56 rounded-lg"
                >
                  {item.items.map((subItem) =>
                    subItem.onClick ? (
                      // Actions (logout, theme toggle): plain DropdownMenuItem + onClick.
                      // Do not use asChild + <a> — these items perform work, they don't navigate.
                      <DropdownMenuItem key={subItem.title} onClick={subItem.onClick}>
                        {subItem.title}
                      </DropdownMenuItem>
                    ) : (
                      // Links: asChild delegates rendering to an <a> for correct semantics and keyboard behavior.
                      <DropdownMenuItem asChild key={subItem.title}>
                        <a href={subItem.url}>{subItem.title}</a>
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuContent>
              ) : null}
            </SidebarMenuItem>
          </DropdownMenu>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
