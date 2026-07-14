// TODO: Refactor
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
import { getDisplayName } from "@/features/profile/utilities/user-avatar";
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
  ],
};

const data = {
  navMain: [
    {
      title: "Openings",
      url: "#",
      icon: "/images/icons/icon-openings.png",
      items: [
        {
          title: "All Openings",
          url: "/openings",
        },
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
      title: "Collections",
      url: "#",
      icon: "/images/icons/icon-book-collection.png",
      items: [
        {
          title: "Library",
          url: "/collection",
        },
        {
          title: "My Collections",
          url: "/user-collection",
        },
      ],
    },

    {
      title: "Other",
      url: "#",
      icon: "/images/icons/icon-more.png",
      items: [
        {
          title: "Contact Us",
          url: "/contact",
        },
        {
          title: "Terms of Service",
          url: "/terms",
        },
        {
          title: "Privacy Policy",
          url: "/privacy",
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

    const myProfileItem = profileSection.items?.find((item) => item.url === "/profile");

    return {
      ...profileSection,
      ...(profile
        ? {
            avatar: {
              src: profile.avatarUrl,
              displayName: getDisplayName(profile),
            },
          }
        : {}),
      items: [...(profile && myProfileItem ? [myProfileItem] : []), ...authItems],
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
        <SidebarMenu className="md:items-center">
          <SidebarMenuItem className="mt-5">
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip="ChessVolt"
              className="group-data-[collapsible=icon]:bg-secondary group-data-[collapsible=icon]:text-primary rounded-lg group-data-[collapsible=icon]:justify-center [&_svg]:size-6"
            >
              <Link href={profile ? "/dashboard" : "/"} aria-label="ChessVolt" className="flex items-center gap-2">
                <span className="bg-secondary flex size-12 shrink-0 items-center justify-center rounded-lg group-data-[collapsible=icon]:size-auto group-data-[collapsible=icon]:bg-transparent">
                  <Zap aria-hidden className="text-primary fill-primary h-6 w-6 shrink-0" />
                </span>
                <span className="text-foreground text-2xl font-bold group-data-[collapsible=icon]:hidden">
                  ChessVolt
                </span>
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
