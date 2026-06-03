"use client";

import { ChessKnight, LogIn, type LucideIcon, Menu, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
};

const NAV_ITEMS: NavItem[] = [
  { href: "/login", label: "Sign in", icon: LogIn, iconPosition: "left" },
  { href: "/collection", label: "Start Playing", icon: ChessKnight },
];

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
      <Zap className={cn("text-primary", sheet ? "h-5 w-5" : "fill-primary h-6 w-6")} />
      <span>ChessVolt</span>
    </Link>
  );
}

function NavLinkContent({ item }: { item: NavItem }) {
  const Icon = item.icon;
  const pos = item.iconPosition ?? "left";
  return (
    <>
      {Icon && pos === "left" && <Icon className="h-4 w-4" />}
      {item.label}
      {Icon && pos === "right" && <Icon className="h-4 w-4" />}
    </>
  );
}

function DesktopNavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  return (
    <Button variant="volt" asChild>
      <Link href={item.href} className="flex items-center gap-2" onClick={onNavigate}>
        <NavLinkContent item={item} />
      </Link>
    </Button>
  );
}

function MobileNavLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <Button variant="volt" className="h-12 w-full text-base" asChild>
      <Link href={item.href} className="flex items-center justify-center gap-2" onClick={onNavigate}>
        <NavLinkContent item={item} />
      </Link>
    </Button>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeSheet = () => setIsOpen(false);

  return (
    <header className="absolute top-0 right-0 left-0 z-50 w-full bg-transparent">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <BrandLogo />

        <nav className="hidden items-center gap-3 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <DesktopNavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="md:hidden">
          {/* Mobile menu */}
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
              <div className="mb-8 flex items-center">
                <BrandLogo variant="sheet" onNavigate={closeSheet} />
              </div>

              <nav className="flex flex-col gap-4" aria-label="Mobile menu">
                {NAV_ITEMS.map((item) => (
                  <MobileNavLink key={item.href} item={item} onNavigate={closeSheet} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
