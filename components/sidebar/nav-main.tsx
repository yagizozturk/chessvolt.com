"use client";

import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

function hasSubmenu(item: NavMainItem) {
  return (item.items?.length ?? 0) > 0;
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-3 group-data-[collapsible=icon]:items-center">
        {items.map((item) => {
          const groupActive = isGroupActive(pathname, item);
          const activeSubUrl = getMostSpecificMatchingSubUrl(pathname, item.items);
          const showSubmenu = hasSubmenu(item);

          if (!showSubmenu && item.url !== "#") {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={groupActive}
                  aria-label={item.title}
                  aria-current={groupActive ? "page" : undefined}
                  className="data-active:shadow-[0_0_0_2px_var(--sidebar-primary)] group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:justify-center focus-visible:ring-0"
                >
                  <Link href={item.url}>
                    {item.icon ? (
                      <Image src={item.icon} alt="" aria-hidden width={32} height={32} className="size-8 shrink-0" />
                    ) : null}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <DropdownMenu key={item.title}>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={groupActive}
                    aria-label={item.title}
                    aria-current={groupActive ? "true" : undefined}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-active:shadow-[0_0_0_2px_var(--sidebar-primary)] group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:justify-center focus-visible:ring-0"
                  >
                    {item.icon ? (
                      <Image src={item.icon} alt="" aria-hidden width={32} height={32} className="size-8 shrink-0" />
                    ) : null}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    <MoreHorizontalIcon className="ml-auto group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                {showSubmenu ? (
                  <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="bg-card-shadow text-sidebar-foreground min-w-56 rounded-lg ring-0"
                  >
                    <DropdownMenuLabel className="text-primary text-sm font-semibold tracking-wide uppercase">
                      {item.title}
                    </DropdownMenuLabel>
                    {item.items!.map((subItem) =>
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
