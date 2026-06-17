"use client";

import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export function NavSettings({
  item,
}: {
  item: {
    title: string;
    url: string;
    icon?: string;
    items?: {
      title: string;
      url: string;
    }[];
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <DropdownMenu>
        <SidebarMenuItem>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-12 focus-visible:ring-0"
            >
              {item.icon ? (
                <Image src={item.icon} alt="" aria-hidden width={32} height={32} className="size-8 shrink-0" />
              ) : null}
              <span>{item.title}</span>
              <MoreHorizontalIcon className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {item.items?.length ? (
            <DropdownMenuContent
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
              className="min-w-56 rounded-lg"
            >
              {item.items.map((subItem) => (
                <DropdownMenuItem asChild key={subItem.title}>
                  <a href={subItem.url}>{subItem.title}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          ) : null}
        </SidebarMenuItem>
      </DropdownMenu>
    </SidebarMenu>
  );
}
