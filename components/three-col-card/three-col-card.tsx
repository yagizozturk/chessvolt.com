"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ThreeColCardProps = {
  /** Left slot, vertically and horizontally centered. */
  left?: ReactNode;
  /** Middle slot, takes the remaining space. */
  children: ReactNode;
  /** Right slot, vertically and horizontally centered. */
  right?: ReactNode;
  /** When set, the whole card becomes a link with a loading state on click. */
  href?: string;
  className?: string;
};

export function ThreeColCard({ left, children, right, href, className }: ThreeColCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const content = (
    <>
      {left ? <div className="flex shrink-0 items-center justify-center">{left}</div> : null}
      <div className="min-w-0 flex-1 space-y-1">{children}</div>
      {right ? <div className="flex shrink-0 items-center justify-center">{right}</div> : null}
    </>
  );

  return (
    <div
      aria-busy={isLoading}
      className={cn("card-border-bottom-shadow relative", isLoading && "pointer-events-none", className)}
    >
      {isLoading ? (
        <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center rounded-xl">
          <Spinner className="size-8" />
        </div>
      ) : null}
      {href ? (
        <Link href={href} onClick={() => setIsLoading(true)} className="group flex items-center gap-4 p-6">
          {content}
        </Link>
      ) : (
        <div className="flex items-center gap-4 p-6">{content}</div>
      )}
    </div>
  );
}
