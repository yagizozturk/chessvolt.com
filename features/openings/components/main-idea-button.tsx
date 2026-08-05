"use client";

import { Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type MainIdeaButtonProps = {
  mainIdea: string;
  active: boolean;
  onActiveChange: (active: boolean) => void;
};

export function MainIdeaButton({ mainIdea, active, onActiveChange }: MainIdeaButtonProps) {
  const trimmedMainIdea = mainIdea.trim();

  if (!trimmedMainIdea) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="voltIcon"
          className="relative"
          aria-label="Main idea"
          aria-pressed={active}
          onClick={() => onActiveChange(!active)}
        >
          <ShineBorder shineColor={["#FFE566", "#F0D148", "#D4A017"]} borderWidth={2} />
          <Lightbulb className={cn("size-5", active && "fill-primary text-primary")} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {active ? "Hide the main idea" : "View the main idea"}
      </TooltipContent>
    </Tooltip>
  );
}
