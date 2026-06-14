"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Collections",
      url: "#",
      icon: "/images/icons/icon-book-collection.png",
      items: [
        {
          title: "My Collections",
          url: "/user-collection",
        },
        {
          title: "Library",
          url: "/collection",
        },
      ],
    },
    {
      title: "Openings",
      url: "#",
      icon: "/images/icons/icon-openings.png",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
      ],
    },
    {
      title: "Contact Us",
      url: "#",
      icon: "/images/icons/icon-contact.png",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
      ],
    },
    {
      title: "Blog",
      url: "#",
      icon: "/images/icons/icon-blog.png",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
      ],
    },
    {
      title: "Profile",
      url: "#",
      icon: "/images/icons/icon-user-profile.png",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "/images/icons/icon-settings.png",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} collapsible="icon" className="!border-r-0">
      <SidebarHeader>
        <SidebarMenu className="items-center pt-2">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="ChessVolt">
              <Link href="/collection">
                <Image
                  src="/images/icons/icon-volt.png"
                  alt=""
                  aria-hidden
                  width={32}
                  height={32}
                  className="size-8 shrink-0"
                />
                <span className="font-medium">ChessVolt</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
