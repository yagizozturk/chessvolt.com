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
      title: "Riddles",
      url: "#",
      icon: "/images/icons/icon-riddle.png",
      items: [
        {
          title: "Routing",
          url: "#",
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
          title: "Change Mode",
          url: "#",
        },
        {
          title: "Contact Us",
          url: "#",
        },
        {
          title: "Blog",
          url: "#",
        },
        {
          title: "Logout",
          url: "#",
        },
      ],
    },
    {
      title: "Other",
      url: "#",
      icon: "/images/icons/icon-more.png",
      items: [
        {
          title: "Switch Mode",
          url: "#",
        },
        {
          title: "Blog",
          url: "#",
        },
        {
          title: "Contact Us",
          url: "#",
        },
        {
          title: "How Volt Works",
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
        <SidebarMenu className="items-center">
          <SidebarMenuItem className="mt-5">
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip="ChessVolt"
              className="hover:bg-transparent active:bg-transparent data-open:hover:bg-transparent"
            >
              <Link href="/collection" aria-label="ChessVolt" className="rounded-lg bg-blue-500">
                <Image
                  src="/images/icons/icon-volt.png"
                  alt=""
                  aria-hidden
                  width={32}
                  height={32}
                  className="size-8 shrink-0"
                />
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
