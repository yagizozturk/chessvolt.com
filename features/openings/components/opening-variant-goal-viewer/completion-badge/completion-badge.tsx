import { Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type CompletionBadgeProps = {
  size?: "sm" | "md";
};

export function CompletionBadge({ size = "md" }: CompletionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm dark:bg-emerald-500",
        size === "md" ? "h-7 w-7" : "h-6 w-6",
      )}
      aria-label="Goal completed"
    >
      <Check className={cn(size === "md" ? "h-4 w-4" : "h-3.5 w-3.5")} strokeWidth={2.75} aria-hidden />
    </span>
  );
}
