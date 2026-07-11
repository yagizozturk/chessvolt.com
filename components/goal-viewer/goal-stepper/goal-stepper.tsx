// TODO: Refactor
"use client";

import Lottie from "lottie-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import coinAnimationData from "@/public/images/animations/animation-coin.json";
import completeAnimationData from "@/public/images/animations/animation-complete.json";

import type { GoalStepperProps } from "../types/types";

const HOVER_CLOSE_MS = 120;
const SCROLL_EDGE_THRESHOLD_PX = 4;
const SCROLL_PAGE_RATIO = 0.85;

const GOAL_ITEM_CLASS = "size-8 shrink-0 snap-center";

export function GoalStepper({ goals }: GoalStepperProps) {
  const activeGoalIndex = goals.findIndex((goal) => !goal.isCompleted);
  const focusIndex = activeGoalIndex >= 0 ? activeGoalIndex : Math.max(0, goals.length - 1);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | HTMLDivElement | null)[]>([]);

  const setItemRef = useCallback((index: number, node: HTMLButtonElement | HTMLDivElement | null) => {
    itemRefs.current[index] = node;
  }, []);

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

  const updateScrollEdges = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;

    setCanScrollStart(scrollLeft > SCROLL_EDGE_THRESHOLD_PX);
    setCanScrollEnd(
      maxScrollLeft > SCROLL_EDGE_THRESHOLD_PX && scrollLeft < maxScrollLeft - SCROLL_EDGE_THRESHOLD_PX,
    );
  }, []);

  const scrollByPage = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const delta = container.clientWidth * SCROLL_PAGE_RATIO * (direction === "left" ? -1 : 1);
    container.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  useLayoutEffect(() => {
    itemRefs.current[focusIndex]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [focusIndex]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollEdges();

    const resizeObserver = new ResizeObserver(updateScrollEdges);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [goals.length, updateScrollEdges]);

  return (
    <div className="flex min-w-0 items-center gap-1">
      {canScrollStart ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label="Scroll goals left"
          onClick={() => scrollByPage("left")}
        >
          <ChevronLeft />
        </Button>
      ) : null}

      <div className="relative min-w-0 flex-1">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0 left-0 z-10 h-8 w-8 bg-gradient-to-r from-card to-transparent transition-opacity duration-200",
            canScrollStart ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0 right-0 z-10 h-8 w-8 bg-gradient-to-l from-card to-transparent transition-opacity duration-200",
            canScrollEnd ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          ref={scrollRef}
          role="list"
          aria-label="Goal progress"
          className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onScroll={updateScrollEdges}
        >
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
                    ref={(node) => setItemRef(index, node)}
                    type="button"
                    role="listitem"
                    className={cn(
                      GOAL_ITEM_CLASS,
                      "bg-muted relative cursor-default overflow-hidden rounded-full border-0 p-0",
                    )}
                    aria-label={`Goal ${index + 1} completed — ${goal.title}`}
                    onMouseEnter={() => {
                      cancelScheduledClose();
                      setOpenIndex(index);
                    }}
                    onMouseLeave={scheduleClose}
                  >
                    <Lottie
                      animationData={goal.ideaSuccessMessage.trim() ? coinAnimationData : completeAnimationData}
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
                      {goal.ideaSuccessMessage.trim() ? (
                        <span className="text-primary text-sm font-semibold">{goal.ideaSuccessMessage}</span>
                      ) : null}
                    </PopoverTitle>
                    <PopoverDescription className="text-xs leading-relaxed">
                      <span className="block">{goal.hint}</span>
                    </PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            ) : (
              <div
                key={index}
                ref={(node) => setItemRef(index, node)}
                role="listitem"
                className={cn(
                  GOAL_ITEM_CLASS,
                  "grid place-items-center rounded-full text-xs font-bold",
                  activeGoalIndex === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
                aria-label={`Goal ${index + 1}`}
                aria-current={activeGoalIndex === index ? "step" : undefined}
              >
                {index + 1}
              </div>
            ),
          )}
        </div>
      </div>

      {canScrollEnd ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label="Scroll goals right"
          onClick={() => scrollByPage("right")}
        >
          <ChevronRight />
        </Button>
      ) : null}
    </div>
  );
}
