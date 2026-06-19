"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { NavMain, type NavMainItem } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useBoardSoundsMenuAction } from "@/components/ui/board-sounds-toggle";
import { useToggleTheme } from "@/components/ui/theme-toggle";
import { useVoltExplainMenuAction } from "@/components/volt-explain-dialog/use-volt-explain-dialog";
import { createClient } from "@/lib/supabase/client";

// Static nav config: link-based submenu items only.
// Settings and Profile actions are injected at runtime in AppSidebar because they need React hooks.
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
          title: "My Openings",
          url: "#",
        },
        {
          title: "",
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
          title: "My Profile",
          url: "/profile",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "/images/icons/icon-settings.png",
      // Populated at runtime — see navMain useMemo below.
      items: [],
    },
    {
      title: "Other",
      url: "#",
      icon: "/images/icons/icon-more.png",
      items: [
        {
          title: "Blog",
          url: "#",
        },
        {
          title: "Contact Us",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  // Single-click light ↔ dark toggle; shared with theme-toggle.tsx via useToggleTheme.
  const toggleViewMode = useToggleTheme();
  const { toggle: toggleSounds, label: soundsLabel } = useBoardSoundsMenuAction();
  // Intentional re-open: does not read localStorage — user chose "How Volt Works".
  const { openDialog: openVoltExplainDialog } = useVoltExplainMenuAction();

  const handleLogout = React.useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  // Merge static nav config with runtime actions (Settings: theme + sounds, Profile: logout).
  const navMain = React.useMemo<NavMainItem[]>(
    () =>
      data.navMain.map((section) => {
        if (section.title === "Settings") {
          return {
            ...section,
            items: [
              { title: "Change Color Mode", onClick: toggleViewMode },
              { title: soundsLabel, onClick: toggleSounds },
            ],
          };
        }

        if (section.title === "Profile") {
          return {
            ...section,
            items: [...(section.items ?? []), { title: "Logout", onClick: handleLogout }],
          };
        }

        if (section.title === "Other") {
          return {
            ...section,
            items: [
              ...(section.items ?? []),
              // Manual open — always available, even after first-view localStorage is set.
              { title: "How Volt Works", onClick: openVoltExplainDialog },
            ],
          };
        }

        return section;
      }),
    [handleLogout, openVoltExplainDialog, toggleViewMode, toggleSounds, soundsLabel],
  );

  return (
    <Sidebar {...props} collapsible="icon" className="!border-r-0">
      <SidebarHeader>
        <SidebarMenu className="items-center">
          <SidebarMenuItem className="mt-5">
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip="ChessVolt"
              className="bg-secondary text-primary hover:bg-primary justify-center rounded-lg [&_svg]:size-6"
            >
              <Link href="/collection" aria-label="ChessVolt">
                <Zap aria-hidden className="shrink-0 fill-current" strokeWidth={0} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
