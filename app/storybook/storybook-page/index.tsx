"use client";

import {
  LayoutPanelTop,
  MousePointerClick,
  RectangleHorizontal,
  Tag,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BadgesShowcase } from "../components/badges/badges-showcase";
import { ButtonShowcase } from "../components/buttons/button-showcase";
import { CardsShowcase } from "../components/cards/cards-showcase";

export default function StorybookPage() {
  const [activeItem, setActiveItem] = useState("#buttons");

  useEffect(() => {
    const syncActiveItem = () => {
      setActiveItem(window.location.hash || "#buttons");
    };

    syncActiveItem();
    window.addEventListener("hashchange", syncActiveItem);

    return () => {
      window.removeEventListener("hashchange", syncActiveItem);
    };
  }, []);

  return (
    <div className="flex min-h-full">
      <aside className="border-border w-56 shrink-0 border-r p-6">
        <Link
          href="/"
          className="text-foreground hover:text-primary mb-6 flex items-center gap-2 text-xl font-bold tracking-tighter"
        >
          <Zap className="h-6 w-6 text-[#fcc800]" />
          <span>chessvolt</span>
        </Link>

        <h2 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wider">
          <LayoutPanelTop className="size-4" />
          Components
        </h2>

        <nav className="mt-4 space-y-1">
          <a
            href="#buttons"
            aria-current={activeItem === "#buttons" ? "page" : undefined}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeItem === "#buttons"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <MousePointerClick className="size-4" />
            Buttons
          </a>
          <a
            href="#badges"
            aria-current={activeItem === "#badges" ? "page" : undefined}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeItem === "#badges"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <Tag className="size-4" />
            Badges
          </a>
          <a
            href="#cards"
            aria-current={activeItem === "#cards" ? "page" : undefined}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeItem === "#cards"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <RectangleHorizontal className="size-4" />
            Cards
          </a>
        </nav>
      </aside>

      <main className="flex-1 space-y-10 overflow-auto p-6">
        <ButtonShowcase />
        <BadgesShowcase />
        <CardsShowcase />
      </main>
    </div>
  );
}
