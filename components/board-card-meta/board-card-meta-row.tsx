import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type BoardCardMetaRowProps = {
  icon: LucideIcon;
  label: string;
  className?: string;
  truncate?: boolean;
};

export function BoardCardMetaRow({ icon: Icon, label, className, truncate }: BoardCardMetaRowProps) {
  if (!label.trim()) {
    return null;
  }

  return (
    <span
      className={cn("flex items-center gap-1.5", truncate && "max-w-full min-w-0 shrink overflow-hidden", className)}
    >
      <Icon className="text-primary h-4 w-4 shrink-0" />
      <span className={cn(truncate && "min-w-0 truncate")}>{label}</span>
    </span>
  );
}
