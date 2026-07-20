// TODO: Refactor
"use client";

import type { LucideIcon } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type BoardCardMetaRowProps = {
  icon: LucideIcon;
  label: string;
  className?: string;
  truncate?: boolean;
  iconTooltip?: string;
  iconClassName?: string;
};

function MetaRowIcon({
  icon: Icon,
  iconTooltip,
  iconClassName,
}: {
  icon: LucideIcon;
  iconTooltip?: string;
  iconClassName?: string;
}) {
  const icon = <Icon className={cn("text-primary h-4 w-4 shrink-0", iconClassName)} />;

  if (!iconTooltip) {
    return icon;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0">{icon}</span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
        {iconTooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function BoardCardMetaRow({
  icon,
  label,
  className,
  truncate,
  iconTooltip,
  iconClassName,
}: BoardCardMetaRowProps) {
  if (!label.trim()) {
    return null;
  }

  return (
    <span
      className={cn("flex items-center gap-1.5", truncate && "max-w-full min-w-0 shrink overflow-hidden", className)}
    >
      <MetaRowIcon icon={icon} iconTooltip={iconTooltip} iconClassName={iconClassName} />
      <span className={cn(truncate && "min-w-0 truncate")}>{label}</span>
    </span>
  );
}
