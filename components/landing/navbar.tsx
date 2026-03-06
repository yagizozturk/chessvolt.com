"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="absolute top-0 right-0 left-0 z-50 w-full bg-transparent">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-white transition-opacity hover:opacity-90"
        >
          <Zap className="fill-primary text-primary h-6 w-6" />
          <span>chessvolt</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 md:flex">
          <Button variant="vghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="vghost" size="sm" asChild>
            <Link href="/signup">Register</Link>
          </Button>
          <Button
            variant="cta"
            size="sm"
            className="shadow-primary/20 shadow-lg"
            asChild
          >
            <Link href="/signup">Start Playing</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-white/10 bg-slate-950/95 px-8 text-white backdrop-blur-md"
            >
              <SheetTitle className="mb-8 text-left text-white">
                <div
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-xl font-bold"
                >
                  <Zap className="text-primary h-5 w-5" />
                  <span>chessvolt</span>
                </div>
              </SheetTitle>

              <nav className="flex flex-col gap-6">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-primary py-2 text-lg font-medium text-white/80 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-primary py-2 text-lg font-medium text-white/80 transition-colors"
                >
                  Register
                </Link>
                <div className="my-2 h-px bg-white/10" />
                <Button
                  className="bg-primary text-primary-foreground h-12 w-full text-base font-semibold"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/signup">Start Playing</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
