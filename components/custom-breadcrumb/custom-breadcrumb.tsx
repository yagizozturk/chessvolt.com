"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  puzzles: "Puzzles",
  openings: "Openings",
  studies: "Studies",
  "game-analysis": "Game Analysis",
  "volt-tracker": "Volt Tracker",
  blog: "Blog",
  profile: "Profile",
};

// Segments without their own page (e.g. /openings/variant/[id], /studies/[slug]/puzzle/[id])
const HIDDEN_SEGMENTS = new Set(["variant", "puzzle"]);

const isId = (segment: string) => /^\d+$/.test(segment) || /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(segment);

const toLabel = (segment: string) =>
  LABELS[segment] ?? decodeURIComponent(segment).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function CustomBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // A slug crumb links through the id segments that follow it (e.g. /openings/[slug]/[id]).
  const crumbs = segments
    .map((segment, i) => {
      let end = i + 1;
      while (end < segments.length && isId(segments[end])) end++;
      return { segment, href: "/" + segments.slice(0, end).join("/") };
    })
    .filter(({ segment }) => !isId(segment) && !HIDDEN_SEGMENTS.has(segment));

  if (crumbs[0]?.segment !== "dashboard") {
    crumbs.unshift({ segment: "dashboard", href: "/dashboard" });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map(({ segment, href }, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <Fragment key={href}>
              {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem className={isLast ? undefined : "hidden md:block"}>
                {isLast ? (
                  <BreadcrumbPage>{toLabel(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{toLabel(segment)}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
