"use client";

import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

// Submenu items are either navigation links or runtime actions.
// TypeScript union: an item has `url` OR `onClick`, never both — avoids fake "#" links for actions.
export type NavSubItem =
  | { title: string; url: string; onClick?: never; isLoading?: never }
  | { title: string; onClick: () => void | Promise<void>; url?: never; isLoading?: boolean };

export type NavMainItem = {
  title: string;
  url: string;
  icon?: string;
  items?: NavSubItem[];
};

function isNavLink(subItem: NavSubItem): subItem is { title: string; url: string } {
  return "url" in subItem && subItem.url !== "#";
}

function isActivePath(pathname: string, href: string) {
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, item: NavMainItem) {
  const linkItems = item.items?.filter(isNavLink);
  if (linkItems?.length) {
    return linkItems.some((sub) => isActivePath(pathname, sub.url));
  }
  return isActivePath(pathname, item.url);
}

function getMostSpecificMatchingSubUrl(pathname: string, items: NavSubItem[] | undefined) {
  if (!items?.length) return null;

  const matches = items.filter((sub): sub is { title: string; url: string } =>
    isNavLink(sub) && isActivePath(pathname, sub.url),
  );
  if (!matches.length) return null;

  return matches.sort((a, b) => b.url.length - a.url.length)[0]?.url ?? null;
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1">
        {items.map((item) => {
          const groupActive = isGroupActive(pathname, item);
          const activeSubUrl = getMostSpecificMatchingSubUrl(pathname, item.items);

          return (
            <DropdownMenu key={item.title}>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    isActive={groupActive}
                    aria-label={item.title}
                    aria-current={groupActive ? "true" : undefined}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-active:bg-transparent data-active:font-normal data-active:text-sidebar-foreground focus-visible:ring-0 group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:!size-auto"
                  >
                    {item.icon ? (
                      <Image src={item.icon} alt="" aria-hidden width={32} height={32} className="size-8 shrink-0" />
                    ) : null}
                    <span
                      className={cn(
                        "truncate font-semibold",
                        "group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:text-xs group-data-[collapsible=icon]:leading-snug",
                        groupActive ? "text-primary" : "text-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                    <MoreHorizontalIcon className="ml-auto group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                {item.items?.length ? (
                  <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="bg-card-shadow text-sidebar-foreground min-w-56 rounded-lg ring-0"
                  >
                    <DropdownMenuLabel className="text-primary text-sm font-semibold tracking-wide uppercase">
                      {item.title}
                    </DropdownMenuLabel>
                    {item.items.map((subItem) =>
                      subItem.onClick ? (
                        <DropdownMenuItem key={subItem.title} onClick={subItem.onClick} disabled={subItem.isLoading}>
                          {subItem.isLoading ? <Spinner data-icon="inline-start" /> : null}
                          {subItem.title}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          asChild
                          key={subItem.title}
                          className={cn(activeSubUrl === subItem.url && "bg-accent font-medium text-accent-foreground")}
                        >
                          <a href={subItem.url} aria-current={activeSubUrl === subItem.url ? "page" : undefined}>
                            {subItem.title}
                          </a>
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                ) : null}
              </SidebarMenuItem>
            </DropdownMenu>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
