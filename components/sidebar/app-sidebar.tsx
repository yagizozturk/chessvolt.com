"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { NavMain, type NavMainItem } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useVoltExplainMenuAction } from "@/components/volt-explain-dialog/use-volt-explain-dialog";
import type { Opening } from "@/features/openings/types/opening";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";

function getOpeningHref(opening: Pick<Opening, "id" | "name" | "slug">) {
  const slug = opening.slug ?? slugify(opening.name);
  return `/openings/${slug}/${opening.id}`;
}

// Static nav config: link-based submenu items only.
// Profile actions are injected at runtime in AppSidebar because they need React hooks.
const profileSection = {
  title: "Profile",
  url: "#",
  icon: "/images/icons/icon-user-profile.png",
  items: [
    {
      title: "My Profile",
      url: "/profile",
    },
    {
      title: "Settings",
      url: "/settings",
    },
  ],
};

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
          url: "/user-opening-variants",
        },
      ],
    },
    {
      title: "Riddles",
      url: "/riddles",
      icon: "/images/icons/icon-riddle.png",
    },
    {
      title: "Other",
      url: "#",
      icon: "/images/icons/icon-more.png",
      items: [
        {
          title: "Contact Us",
          url: "#",
        },
        {
          title: "Terms of Service",
          url: "#",
        },
        {
          title: "Privacy Policy",
          url: "#",
        },
      ],
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  openings?: Pick<Opening, "id" | "name" | "slug">[];
};

export function AppSidebar({ openings = [], ...props }: AppSidebarProps) {
  const router = useRouter();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  // Intentional re-open: does not read localStorage — user chose "How Volt Works".
  const { openDialog: openVoltExplainDialog } = useVoltExplainMenuAction();

  const handleLogout = React.useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [isLoggingOut, router]);

  const navProfile = React.useMemo<NavMainItem>(() => {
    const authItems = profile
      ? [{ title: "Logout", onClick: handleLogout, isLoading: isLoggingOut }]
      : isProfileLoading
        ? []
        : [{ title: "Login", url: "/login" }];

    const settingsItem = profileSection.items?.find((item) => item.url === "/settings");
    const myProfileItem = profileSection.items?.find((item) => item.url === "/profile");

    return {
      ...profileSection,
      items: [
        ...(settingsItem ? [settingsItem] : []),
        ...(profile && myProfileItem ? [myProfileItem] : []),
        ...authItems,
      ],
    };
  }, [handleLogout, isLoggingOut, isProfileLoading, profile]);

  const navMain = React.useMemo<NavMainItem[]>(
    () =>
      data.navMain.map((section) => {
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

        if (section.title === "Openings") {
          return {
            ...section,
            items: [
              ...(section.items ?? []),
              ...openings.map((opening) => ({
                title: opening.name,
                url: getOpeningHref(opening),
              })),
            ],
          };
        }

        return section;
      }),
    [openVoltExplainDialog, openings],
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
      <SidebarFooter>
        <NavMain items={[navProfile]} />
      </SidebarFooter>
    </Sidebar>
  );
}
