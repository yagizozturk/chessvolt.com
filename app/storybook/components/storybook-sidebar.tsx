"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutPanelTop, Map, PieChart, Sparkles, Zap } from "lucide-react";
import * as React from "react";

import { NavMain } from "./nav-main";

const data = {
  user: {
    name: "Storybook",
    email: "ui@chessvolt.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ChessVolt",
      logo: <Zap className="text-primary size-4" />,
      plan: "Design System",
    },
  ],
  navMain: [
    {
      title: "Components",
      url: "#",
      icon: <LayoutPanelTop className="size-4" />,
      isActive: true,
      items: [
        {
          title: "Buttons",
          url: "#buttons",
        },
        {
          title: "Badges",
          url: "#badges",
        },
        {
          title: "Cards",
          url: "#cards",
        },
        {
          title: "Colors",
          url: "#colors",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Tokens",
      url: "#colors",
      icon: <Sparkles className="size-4" />,
    },
    {
      name: "Components",
      url: "#buttons",
      icon: <PieChart className="size-4" />,
    },
    {
      name: "Layouts",
      url: "#cards",
      icon: <Map className="size-4" />,
    },
  ],
};

export function StorybookSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Zap className="size-5 text-[#fcc800]" />
            <span className="text-sm font-semibold tracking-tight">
              chessvolt
            </span>
          </div>
        </SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
