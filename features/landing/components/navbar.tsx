"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogIn, type LucideIcon, Menu, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  {
    href: "/login",
    label: "Sign in",
    icon: LogIn,
    iconPosition: "left" as const,
  },
  {
    href: "/challenge",
    label: "Start Playing",
    isCta: true,
  },
] satisfies Array<{
  href: string;
  label: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isCta?: boolean;
}>;

function NavLink({
  href,
  label,
  icon: Icon,
  iconPosition,
  isCta,
  onNavigate,
  className = "",
  iconSize = "h-4 w-4",
}: {
  href: string;
  label: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isCta?: boolean;
  onNavigate?: () => void;
  className?: string;
  iconSize?: string;
}) {
  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon className={iconSize} />}
      {label}
      {Icon && iconPosition === "right" && <Icon className={iconSize} />}
    </>
  );

  if (isCta) {
    return (
      <Button
        variant="cta"
        size="sm"
        className={`shadow-primary/20 shadow-lg ${className}`}
        asChild
      >
        <Link
          href={href}
          className="flex items-center gap-2"
          onClick={onNavigate}
        >
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button variant="vghost" size="sm" asChild>
      <Link
        href={href}
        className={`flex items-center gap-2 ${className}`}
        onClick={onNavigate}
      >
        {content}
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
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-white transition-opacity hover:opacity-90"
          aria-label="chessvolt - Home"
        >
          <Zap className="fill-primary text-primary h-6 w-6" />
          <span>chessvolt</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-3 md:flex"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              iconPosition={item.iconPosition ?? "left"}
              isCta={item.isCta}
            />
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-white/10 bg-slate-950/95 px-8 text-white backdrop-blur-md"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mb-8 flex items-center justify-between">
                <Link
                  href="/"
                  onClick={closeSheet}
                  className="flex items-center gap-2 text-xl font-bold text-white"
                  aria-label="chessvolt - Go to home"
                >
                  <Zap className="text-primary h-5 w-5" />
                  <span>chessvolt</span>
                </Link>
                <ThemeToggle />
              </div>

              <nav className="flex flex-col gap-6" aria-label="Mobile menu">
                <Link
                  href="/login"
                  onClick={closeSheet}
                  className="hover:text-primary flex items-center gap-2 py-2 text-lg font-medium text-white/80 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  Sign in
                </Link>
                <div className="my-2 h-px bg-white/10" aria-hidden />
                <Button
                  className="bg-primary text-primary-foreground h-12 w-full text-base font-semibold"
                  asChild
                  onClick={closeSheet}
                >
                  <Link
                    href="/challenge"
                    className="flex items-center justify-center gap-2"
                  >
                    Start Playing
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
