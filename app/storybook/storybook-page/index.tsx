"use client";

import {
  LayoutPanelTop,
  MousePointerClick,
  Palette,
  RectangleHorizontal,
  Tag,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BadgesShowcase } from "../components/badges/badges-showcase";
import { ButtonShowcase } from "../components/buttons/button-showcase";
import { CardsShowcase } from "../components/cards/cards-showcase";
import { ColorsShowcase } from "../components/colors/colors-showcase";

const navItems = [
  {
    id: "#buttons",
    label: "Buttons",
    icon: MousePointerClick,
  },
  {
    id: "#badges",
    label: "Badges",
    icon: Tag,
  },
  {
    id: "#cards",
    label: "Cards",
    icon: RectangleHorizontal,
  },
  {
    id: "#colors",
    label: "Colors",
    icon: Palette,
  },
] as const;

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
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.id}
                href={item.id}
                aria-current={activeItem === item.id ? "page" : undefined}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeItem === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 space-y-10 overflow-auto p-6">
        <ButtonShowcase />
        <BadgesShowcase />
        <CardsShowcase />
        <ColorsShowcase />
      </main>
    </div>
  );
}
