"use client";

import { BookOpenIcon, Gamepad2Icon, HelpCircleIcon, LayoutDashboardIcon, UsersIcon } from "lucide-react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

import { AdminNavMain, type AdminNavMainItem } from "./admin-nav-main";
import { AdminNavUser } from "./admin-nav-user";
import { AdminSidebarBrand } from "./admin-sidebar-brand";

const adminNavItems: AdminNavMainItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: <UsersIcon />,
  },
  {
    title: "Games",
    url: "/admin/games",
    icon: <Gamepad2Icon />,
    items: [
      { title: "All games", url: "/admin/games" },
      { title: "New game", url: "/admin/games/new" },
      { title: "Import PGN", url: "/admin/games/import" },
    ],
  },
  {
    title: "Riddles",
    url: "/admin/riddles",
    icon: <HelpCircleIcon />,
    items: [
      { title: "All riddles", url: "/admin/riddles" },
      { title: "New FEN included PGN", url: "/admin/riddles/new/pgn-to-fen" },
      { title: "Bulk FEN included PGN", url: "/admin/riddles/bulk/pgn-to-fen" },
    ],
  },
  {
    title: "Openings",
    url: "/admin/openings",
    icon: <BookOpenIcon />,
    items: [
      { title: "All openings", url: "/admin/openings" },
      { title: "Create opening", url: "/admin/openings/create" },
      { title: "Bulk variants", url: "/admin/openings/variants/bulk" },
    ],
  },
];

type Props = React.ComponentProps<typeof Sidebar> & {
  userEmail: string;
};

export function AdminAppSidebar({ userEmail, ...props }: Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminSidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain items={adminNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser email={userEmail} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
