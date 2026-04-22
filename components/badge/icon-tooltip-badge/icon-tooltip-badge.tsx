"use client";

import { BookOpen, Layers, Sword, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const iconMap = {
  bookOpen: BookOpen,
  layers: Layers,
  target: Target,
  sword: Sword,
} as const;

export type IconTooltipBadgeIconName = keyof typeof iconMap;

type IconTooltipBadgeProps = {
  title: string;
  iconName: IconTooltipBadgeIconName;
  size?: number;
  className?: string;
};

export function IconTooltipBadge({ title, iconName, size = 28, className }: IconTooltipBadgeProps) {
  const Icon = iconMap[iconName];
  const iconSize = Math.max(12, Math.round(size * 0.5));

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn("shrink-0 justify-center rounded-xl p-0", className)}
            style={{ width: size, height: size }}
            aria-label={title}
          >
            <Icon style={{ width: iconSize, height: iconSize }} />
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          <span>{title}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
