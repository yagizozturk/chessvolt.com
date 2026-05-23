"use client";

import Lottie from "lottie-react";
import { useCallback, useRef, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import coinAnimationData from "@/public/images/animations/animation-coin.json";
import completeAnimationData from "@/public/images/animations/animation-complete.json";

import type { GoalStepperProps } from "../types/types";

const HOVER_CLOSE_MS = 120;

export function GoalStepper({ goals }: GoalStepperProps) {
  const activeGoalIndex = goals.findIndex((goal) => !goal.isCompleted);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelScheduledClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenIndex(null);
      closeTimerRef.current = null;
    }, HOVER_CLOSE_MS);
  }, [cancelScheduledClose]);

  const handlePopoverOpenChange = useCallback(
    (open: boolean, index: number) => {
      if (!open) {
        cancelScheduledClose();
        setOpenIndex((current) => (current === index ? null : current));
      }
    },
    [cancelScheduledClose],
  );

  return (
    <div className="flex items-center gap-2">
      {goals.map((goal, index) =>
        goal.isCompleted ? (
          <Popover
            key={index}
            modal={false}
            open={openIndex === index}
            onOpenChange={(open) => handlePopoverOpenChange(open, index)}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="bg-muted relative size-8 cursor-default overflow-hidden rounded-full border-0 p-0"
                aria-label={`Goal ${index + 1} completed — ${goal.title}`}
                onMouseEnter={() => {
                  cancelScheduledClose();
                  setOpenIndex(index);
                }}
                onMouseLeave={scheduleClose}
              >
                <Lottie
                  animationData={goal.card ? coinAnimationData : completeAnimationData}
                  loop={false}
                  autoplay={true}
                  className="pointer-events-none absolute inset-0 size-full scale-[1.90]"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="center"
              sideOffset={12}
              collisionPadding={{ top: 16, bottom: 12, left: 12, right: 12 }}
              className="bg-muted w-72 gap-2 p-3 ring-0"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onMouseEnter={cancelScheduledClose}
              onMouseLeave={scheduleClose}
            >
              <PopoverHeader className="gap-1.5">
                <PopoverTitle className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span>{goal.title}</span>
                  {goal.card ? (
                    <span className="text-primary text-sm font-semibold">{goal.card}</span>
                  ) : null}
                </PopoverTitle>
                <PopoverDescription className="text-xs leading-relaxed">{goal.description}</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        ) : (
          <div
            key={index}
            className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
              activeGoalIndex === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            aria-label={`Goal ${index + 1}`}
          >
            {index + 1}
          </div>
        ),
      )}
    </div>
  );
}
