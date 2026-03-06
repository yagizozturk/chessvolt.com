"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Map,
  Puzzle,
  Zap,
  LogIn,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { href: "/", label: "Home", icon: Home, color: "text-[#14b8a6]" },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "text-[#00B3FF]",
  },
  {
    href: "/journey/magnus-plays",
    label: "Journey",
    icon: Map,
    color: "text-[#22c55e]",
  },
  { href: "/puzzle", label: "Puzzles", icon: Puzzle, color: "text-[#a855f7]" },
];

const authItems = [
  { href: "/login", label: "Log in", icon: LogIn, color: "text-[#3b82f6]" },
  {
    href: "/signup",
    label: "Sign up",
    icon: UserPlus,
    color: "text-[#ec4899]",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border flex h-screen w-72 shrink-0 flex-col border-2 border-r">
      <div className="flex h-20 items-center px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight text-white"
        >
          <Zap className="h-8 w-8 text-[#fcc800]" />
          <span className="text-xl">chessvolt</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl px-4 py-4 transition-colors",
                  "hover:bg-white/5",
                  isActive
                    ? "border-2 border-[#00B3FF] bg-[#2C4F5A]/80 text-[#00B3FF]"
                    : "border-2 border-transparent text-[#C8C8C8]",
                )}
              >
                <item.icon
                  className={cn(
                    "h-7 w-7 shrink-0",
                    isActive ? "text-[#00B3FF]" : item.color,
                  )}
                />
                <span className="text-base font-bold tracking-wide uppercase">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <nav className="mt-2 space-y-2">
          {authItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl px-4 py-4 transition-colors",
                  "hover:bg-white/5",
                  isActive
                    ? "border-2 border-[#00B3FF] bg-[#2C4F5A]/80 text-[#00B3FF]"
                    : "border-2 border-transparent text-[#C8C8C8]",
                )}
              >
                <item.icon
                  className={cn(
                    "h-7 w-7 shrink-0",
                    isActive ? "text-[#00B3FF]" : item.color,
                  )}
                />
                <span className="text-base font-bold tracking-wide uppercase">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
