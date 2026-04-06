"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type VariantSliderItem = {
  id: string;
  title: string | null;
};

type VariantSliderProps = {
  variants: VariantSliderItem[];
  activeVariantId: string;
};

export function VariantSlider({
  variants,
  activeVariantId,
}: VariantSliderProps) {
  if (variants.length <= 1) return null;

  const activeVariant = variants.find((v) => v.id === activeVariantId);
  const activeTitle = activeVariant?.title?.trim() || "Variation";

  return (
    <div className="flex flex-col items-center gap-1.5 py-2">
      <div
        className="flex flex-wrap items-center justify-center gap-2.5"
        role="navigation"
        aria-label="Opening variations"
      >
        {variants.map((v) => {
          const label = v.title?.trim() || "Variation";
          const isActive = v.id === activeVariantId;
          return (
            <Tooltip key={v.id} delayDuration={200}>
              <TooltipTrigger asChild>
                <Link
                  href={`/openings/variant/${v.id}`}
                  className={cn(
                    "focus-visible:ring-offset-background inline-flex size-2.5 shrink-0 rounded-full transition-[transform,background-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    isActive
                      ? "ring-offset-background scale-125 bg-blue-500 ring-2 ring-blue-500/40 ring-offset-2 focus-visible:ring-blue-400"
                      : "bg-muted-foreground/35 hover:bg-muted-foreground/50 focus-visible:ring-muted-foreground/50 hover:scale-125",
                  )}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={label}
                />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                {label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <p
        className="text-muted-foreground/80 max-w-full truncate px-2 text-center text-xs"
        aria-live="polite"
      >
        {activeTitle}
      </p>
    </div>
  );
}
