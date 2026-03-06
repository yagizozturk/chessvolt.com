"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Puzzle,
  Zap,
  LogIn,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/journey", label: "Journey", icon: Map },
  { href: "/puzzle", label: "Puzzles", icon: Puzzle },
];

const authItems = [
  { href: "/login", label: "Log in", icon: LogIn },
  { href: "/signup", label: "Sign up", icon: UserPlus },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#1a1147]/95">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-white"
        >
          <Zap className="h-5 w-5 text-[#FFB800]" />
          chessvolt
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white",
                  isActive && "bg-white/10 text-[#FFB800]"
                )}
                asChild
              >
                <Link href={item.href} className="flex w-full items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                </Link>
              </Button>
            );
          })}
        </nav>
        <Separator className="my-4 bg-white/20" />
        <nav className="space-y-1">
          {authItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white",
                  isActive && "bg-white/10 text-[#FFB800]"
                )}
                asChild
              >
                <Link href={item.href} className="flex w-full items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
