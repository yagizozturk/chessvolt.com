"use client";

import { Lightbulb } from "lucide-react";
import { useState } from "react";

import { MainIdeaCard } from "@/components/main-idea-card/main-idea-card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type MainIdeaButtonProps = {
  mainIdea: string;
};

export function MainIdeaButton({ mainIdea }: MainIdeaButtonProps) {
  const [open, setOpen] = useState(false);
  const trimmedMainIdea = mainIdea.trim();

  if (!trimmedMainIdea) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button type="button" variant="voltIcon" aria-label="Main idea">
              <Lightbulb className={cn("size-5", open && "fill-primary text-primary")} />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          {open ? "Hide the main idea" : "View the main idea"}
        </TooltipContent>
      </Tooltip>
      <PopoverContent side="top" align="end" className="w-[min(28rem,calc(100vw-2rem))] p-0">
        <MainIdeaCard mainIdea={trimmedMainIdea} />
      </PopoverContent>
    </Popover>
  );
}
