"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutPanelTop, Zap } from "lucide-react";
import * as React from "react";

import { NavMain } from "./nav-main";

const data = {
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
      url: "/storybook/buttons",
      icon: <LayoutPanelTop className="size-4" />,
      isActive: true,
      items: [
        {
          title: "Buttons",
          url: "/storybook/buttons",
        },
        {
          title: "Badges",
          url: "/storybook/badges",
        },
        {
          title: "Board",
          url: "/storybook/board",
        },
        {
          title: "Cards",
          url: "/storybook/cards",
        },
        {
          title: "Colors",
          url: "/storybook/colors",
        },
        {
          title: "Collections",
          url: "/storybook/collection-header",
        },
        {
          title: "Misc",
          url: "/storybook/misc",
        },
      ],
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
            <Zap className="size-5" />
            <span className="text-base font-bold tracking-tight">
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
