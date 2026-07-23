"use client";

import {
  BookOpenIcon,
  ClipboardListIcon,
  FolderOpenIcon,
  Gamepad2Icon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SparklesIcon,
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
      { title: "PGN + ply", url: "/admin/riddles/new/pgn-ply" },
      { title: "From game", url: "/admin/riddles/new/from-game" },
      { title: "Bulk PGN", url: "/admin/riddles/new/bulk" },
      { title: "Lichess CSV", url: "/admin/riddles/new/lichess" },
      { title: "Backfill goals (Ollama)", url: "/admin/move-sequences/backfill-goals" },
      { title: "Backfill goals (Gemini)", url: "/admin/move-sequences/backfill-goals-gemini" },
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
      { title: "Theme links", url: "/admin/content-themes" },
      { title: "New theme link", url: "/admin/content-themes/create" },
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
      { title: "PGN goals preview", url: "/admin/openings/variants/pgn-goals-preview" },
      { title: "Backfill goals (Gemini)", url: "/admin/openings/variants/backfill-goals-gemini" },
    ],
  },
  {
    title: "Animations",
    url: "/admin/animations",
    icon: <SparklesIcon />,
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
