"use client";

import {
  BookOpenIcon,
  ClipboardListIcon,
  FolderOpenIcon,
  Gamepad2Icon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react";

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
      { title: "New FEN included PGN", url: "/admin/riddles/new" },
      { title: "Bulk FEN included PGN", url: "/admin/riddles/bulk" },
      { title: "New Riddle From Game", url: "/admin/riddles/new/riddle-from-game" },
    ],
  },
  {
    title: "Collections",
    url: "/admin/collections",
    icon: <FolderOpenIcon />,
    items: [
      { title: "All collections", url: "/admin/collections" },
      { title: "New collection", url: "/admin/collections/create" },
    ],
  },
  {
    title: "Themes",
    url: "/admin/themes",
    icon: <TagsIcon />,
    items: [
      { title: "All themes", url: "/admin/themes" },
      { title: "New theme", url: "/admin/themes/create" },
      { title: "Content themes", url: "/admin/content-themes" },
      { title: "New content link", url: "/admin/content-themes/create" },
    ],
  },
  {
    title: "Onboarding",
    url: "/admin/onboarding-questions",
    icon: <ClipboardListIcon />,
    items: [
      { title: "All questions", url: "/admin/onboarding-questions" },
      { title: "New question", url: "/admin/onboarding-questions/create" },
      { title: "All options", url: "/admin/onboarding-options" },
      { title: "New option", url: "/admin/onboarding-options/create" },
      { title: "Option themes", url: "/admin/onboarding-option-themes" },
      { title: "New option theme", url: "/admin/onboarding-option-themes/create" },
      { title: "User answers", url: "/admin/user-onboarding-answers" },
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
