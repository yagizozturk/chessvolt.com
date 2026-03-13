"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap,
  Menu,
  Home,
  LayoutDashboard,
  Map,
  Puzzle,
  BookOpen,
  User,
  LogOut,
  Flame,
  Sparkles,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utilities/cn";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { useStatsStore } from "@/features/home/store/stats-store";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/challenge", label: "Challenges", icon: Map },
  { href: "/reps", label: "Opening Crusher", icon: BookOpen },
];

export function DashboardNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();
  const streak = useStatsStore((state) => state.streak);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const rightSection = (
    <div className="flex items-center gap-2">
      {/* XP */}
      <div className="bg-muted/60 hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:flex">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-semibold tabular-nums">
          {profile?.xp ?? "—"}
        </span>
      </div>

      {/* Streak */}
      <div className="bg-muted/60 hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:flex">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-semibold tabular-nums">{streak}</span>
      </div>

      {/* Profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
              <User className="text-primary h-4 w-4" />
            </div>
            <span className="sr-only">Profile menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-2">
            <p className="text-sm font-medium">{profile?.username ?? "User"}</p>
            <p className="text-muted-foreground text-xs">
              {profile?.xp ?? 0} XP
            </p>
          </div>
          <DropdownMenuItem asChild>
            <Link href="/challenge">Challenges</Link>
          </DropdownMenuItem>
          {profile?.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dark mode - right side, rounded */}
      <ThemeToggle className="rounded-full" />
    </div>
  );

  return (
    <header className="border-border bg-background sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Left: Logo */}
        <Link
          href="/"
          className="text-foreground flex shrink-0 items-center gap-2 text-xl font-bold tracking-tighter transition-opacity hover:opacity-90"
        >
          <Zap className="fill-primary text-primary h-6 w-6" />
          <span>chessvolt</span>
        </Link>

        {/* Center: Nav items (desktop) */}
        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link
                  href={item.href}
                  className={cn(isActive && "font-semibold")}
                >
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Right: XP, Streak, Theme, Profile (desktop) */}
        <div className="hidden items-center gap-2 md:flex">{rightSection}</div>

        {/* Mobile: Menu + right section */}
        <div className="flex items-center gap-2 md:hidden">
          {rightSection}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetTitle className="mb-8 text-left">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-xl font-bold"
                >
                  <Zap className="fill-primary text-primary h-5 w-5" />
                  <span>chessvolt</span>
                </Link>
              </SheetTitle>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
                {profile?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-amber-600 transition-colors dark:text-amber-400"
                  >
                    <Shield className="h-5 w-5 shrink-0" />
                    Admin Panel
                  </Link>
                )}
              </nav>
              <div className="border-border mt-4 flex flex-col gap-2 border-t pt-4">
                <div className="bg-muted/60 flex items-center justify-between rounded-lg px-4 py-3">
                  <span className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    XP
                  </span>
                  <span className="font-semibold tabular-nums">
                    {profile?.xp ?? "—"}
                  </span>
                </div>
                <div className="bg-muted/60 flex items-center justify-between rounded-lg px-4 py-3">
                  <span className="flex items-center gap-2 text-sm">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Streak
                  </span>
                  <span className="font-semibold tabular-nums">{streak}</span>
                </div>
                <ThemeToggle className="rounded-full" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
