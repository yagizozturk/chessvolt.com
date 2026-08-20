"use client";

import { BookmarkCheck, BookmarkX } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type BoardStatusIconProps = {
  status: "solved" | "wrong";
};

const STATUS_CONFIG = {
  solved: {
    label: "Solved Correctly",
    Icon: BookmarkCheck,
    className: "h-10 w-10 fill-emerald-100 text-emerald-500",
  },
  wrong: {
    label: "Solved Incorrectly",
    Icon: BookmarkX,
    className: "h-10 w-10 text-red-500",
  },
} as const;

export function BoardStatusIcon({ status }: BoardStatusIconProps) {
  const { label, Icon, className } = STATUS_CONFIG[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="absolute top-[-7px] right-2 z-10 cursor-default">
          <Icon className={className} aria-label={label} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
