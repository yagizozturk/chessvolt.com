"use client";

import {
  BookOpenIcon,
  ClipboardListIcon,
  FolderOpenIcon,
  Gamepad2Icon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  TagsIcon,
  ListChecksIcon,
  TestTubeDiagonalIcon,
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
  {
    title: "Storybook",
    url: "/admin/storybook/buttons",
    icon: <PaletteIcon />,
    items: [
      { title: "Buttons", url: "/admin/storybook/buttons" },
      { title: "Badges", url: "/admin/storybook/badges" },
      { title: "Board", url: "/admin/storybook/board" },
      { title: "Cards", url: "/admin/storybook/cards" },
      { title: "Colors", url: "/admin/storybook/colors" },
      { title: "Misc", url: "/admin/storybook/misc" },
      { title: "Updated board", url: "/admin/storybook/updated-board" },
    ],
  },
  {
    title: "Refactor",
    url: "/admin/refactor",
    icon: <ListChecksIcon />,
  },
  {
    title: "Test",
    url: "/admin/test/test-board",
    icon: <TestTubeDiagonalIcon />,
    items: [
      { title: "Animate", url: "/admin/test/animate" },
      { title: "Animated list", url: "/admin/test/animated-list" },
      { title: "Confetti", url: "/admin/test/confetti" },
      { title: "Joyride", url: "/admin/test/joyride" },
      { title: "PGN navigator", url: "/admin/test/pgn-navigator" },
      { title: "PGN reader", url: "/admin/test/pgn-reader" },
      { title: "Progressive blur", url: "/admin/test/progressive-blur" },
      { title: "Shine border", url: "/admin/test/shine-border" },
      { title: "Skeleton", url: "/admin/test/skeleton" },
      { title: "Solve success dialog", url: "/admin/test/solve-success-dialog" },
      { title: "Sonner", url: "/admin/test/sonner" },
      { title: "Test board", url: "/admin/test/test-board" },
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
