import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Apply to each Button inside <ControllerActions>. The label shrinks with the
 * row's width (container queries), and buttons keep their content width so the
 * row wraps instead of letting text overflow when even the smallest size won't fit.
 */
export const controllerActionButtonClassName =
  "flex-1 text-[11px] tracking-wide @[18rem]:text-xs @[18rem]:tracking-wider @[22rem]:text-sm @[22rem]:tracking-[0.1em]";

export function ControllerActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("@container flex flex-wrap gap-x-2 gap-y-3", className)} {...props} />;
}
