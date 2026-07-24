"use client";

import { ChessKnight, LogOutIcon, type LucideIcon, Menu, UserIcon, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { UserAvatar } from "@/features/profile/components/user-avatar";
import { useProfile } from "@/features/profile/hooks/use-profile";
import type { Profile } from "@/features/profile/types/profile";
import { getDisplayName } from "@/features/profile/utilities/user-avatar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type NonNullProfile = Exclude<Profile, null>;

type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
};

const SIGN_IN_ITEM: NavItem = {
  href: "/login",
  label: "Start Learning",
  icon: ChessKnight,
  iconPosition: "left",
};

const START_PLAYING_ITEM: NavItem = {
  href: "/dashboard",
  label: "Start Playing",
  icon: ChessKnight,
  iconPosition: "left",
};

function BrandLogo({ onNavigate, variant = "header" }: { onNavigate?: () => void; variant?: "header" | "sheet" }) {
  const sheet = variant === "sheet";
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2 font-bold transition-opacity hover:opacity-90",
        sheet ? "text-xl text-white" : "text-foreground text-2xl tracking-tighter",
      )}
      aria-label={sheet ? "ChessVolt - Go to home" : "ChessVolt - Home"}
    >
      <Zap className="text-primary fill-primary h-6 w-6 shrink-0" />
      <span>ChessVolt</span>
    </Link>
  );
}

function NavLinkContent({ item, isNavigating }: { item: NavItem; isNavigating?: boolean }) {
  const Icon = item.icon;
  const pos = item.iconPosition ?? "left";
  return (
    <>
      {isNavigating ? (
        <Spinner data-icon="inline-start" />
      ) : (
        Icon && pos === "left" && <Icon className="h-4 w-4" />
      )}
      {item.label}
      {!isNavigating && Icon && pos === "right" && <Icon className="h-4 w-4" />}
    </>
  );
}

function DesktopNavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <Button variant="volt" asChild>
      <Link
        href={item.href}
        aria-busy={isNavigating}
        className={cn("flex items-center gap-2", isNavigating && "pointer-events-none")}
        onClick={() => {
          setIsNavigating(true);
          onNavigate?.();
        }}
      >
        <NavLinkContent item={item} isNavigating={isNavigating} />
      </Link>
    </Button>
  );
}

function ProfileMenu({ profile }: { profile: NonNullProfile }) {
  const router = useRouter();
  const displayName = getDisplayName(profile);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2"
          aria-label="Open profile menu"
        >
          <UserAvatar avatarUrl={profile.avatarUrl} displayName={displayName} className="size-9" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatar avatarUrl={profile.avatarUrl} displayName={displayName} className="size-8" />
            <div className="grid flex-1 leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              {profile.email ? <span className="text-muted-foreground truncate text-xs">{profile.email}</span> : null}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <Button variant="volt" className="h-12 w-full text-base" asChild>
      <Link
        href={item.href}
        aria-busy={isNavigating}
        className={cn("flex items-center justify-center gap-2", isNavigating && "pointer-events-none")}
        onClick={() => {
          setIsNavigating(true);
          onNavigate();
        }}
      >
        <NavLinkContent item={item} isNavigating={isNavigating} />
      </Link>
    </Button>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, isLoading } = useProfile();
  const router = useRouter();
  const closeSheet = () => setIsOpen(false);

  async function handleLogout() {
    closeSheet();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="absolute top-0 right-0 left-0 z-50 w-full bg-transparent">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <BrandLogo />

        <nav className="hidden items-center gap-4 md:flex" aria-label="Main navigation">
          {!isLoading &&
            (profile ? <DesktopNavLink item={START_PLAYING_ITEM} /> : <DesktopNavLink item={SIGN_IN_ITEM} />)}
          {profile && <ProfileMenu profile={profile} />}
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          {profile && <ProfileMenu profile={profile} />}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-foreground/10"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-slate-950/95 px-8 text-white backdrop-blur-md">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-4 mb-8 flex h-8 items-center pr-10">
                <BrandLogo variant="sheet" onNavigate={closeSheet} />
              </div>

              <nav className="flex flex-col gap-6" aria-label="Mobile menu">
                {!isLoading &&
                  (profile ? (
                    <MobileNavLink item={START_PLAYING_ITEM} onNavigate={closeSheet} />
                  ) : (
                    <MobileNavLink item={SIGN_IN_ITEM} onNavigate={closeSheet} />
                  ))}
                {profile && (
                  <>
                    <Button variant="voltMuted" className="h-12 w-full gap-2 text-base" asChild>
                      <Link href="/profile" onClick={closeSheet}>
                        <UserIcon />
                        My Profile
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="voltMuted"
                      onClick={handleLogout}
                      className="h-12 w-full gap-2 text-base"
                    >
                      <LogOutIcon />
                      Log out
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
