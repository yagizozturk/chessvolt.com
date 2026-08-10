"use client";

import Lottie from "lottie-react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from "@/components/ui/popover";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";
import checkpointAnimationData from "@/public/images/animations/animation-book.json";
import completeAnimationData from "@/public/images/animations/animation-complete.json";
import bookIcon from "@/public/images/icons/icon-book.png";

import type { GoalStepperProps } from "../types/types";

const HOVER_CLOSE_MS = 120;
const SCROLL_EDGE_THRESHOLD_PX = 4;
const SCROLL_PAGE_RATIO = 0.85;

const GOAL_ITEM_CLASS = "shrink-0 snap-center";
const TAKEAWAY_SHINE_COLORS = ["#A07CFE", "#FE8FB5", "#FFBE7B"];

export function GoalStepper({ goals, mode = "practice" }: GoalStepperProps) {
  const activeGoalIndex = goals.findIndex((goal) => !goal.isCompleted);
  const focusIndex = activeGoalIndex >= 0 ? activeGoalIndex : Math.max(0, goals.length - 1);
  const lastCompletedIndex = goals.findLastIndex((goal) => goal.isCompleted);
  const lastCompletedGoal = lastCompletedIndex >= 0 ? goals[lastCompletedIndex] : null;
  const lastCompletedTakeaway =
    mode === "learn" && lastCompletedGoal && lastCompletedGoal.takeaway.trim().length > 0 ? lastCompletedGoal : null;

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);
  const [isTakeawayStepVisible, setIsTakeawayStepVisible] = useState(true);
  const [connector, setConnector] = useState<{ left: number; top: number; height: number } | null>(null);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const takeawayCardRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | HTMLDivElement | null)[]>([]);
  const showTakeaway = Boolean(lastCompletedTakeaway) && isTakeawayStepVisible;

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

  const updateConnector = useCallback(() => {
    const container = containerRef.current;
    const step = showTakeaway ? itemRefs.current[lastCompletedIndex] : null;
    const card = takeawayCardRef.current;

    if (!container || !step || !card) {
      setConnector(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const stepRect = step.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const height = cardRect.top - stepRect.bottom;

    if (height <= 0) {
      setConnector(null);
      return;
    }

    setConnector({
      left: stepRect.left + stepRect.width / 2 - containerRect.left,
      top: stepRect.bottom - containerRect.top,
      height,
    });
  }, [lastCompletedIndex, showTakeaway]);

  const updateScrollEdges = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;

    setCanScrollStart(scrollLeft > SCROLL_EDGE_THRESHOLD_PX);
    setCanScrollEnd(maxScrollLeft > SCROLL_EDGE_THRESHOLD_PX && scrollLeft < maxScrollLeft - SCROLL_EDGE_THRESHOLD_PX);

    if (lastCompletedTakeaway) {
      const step = itemRefs.current[lastCompletedIndex];
      if (step) {
        const containerRect = container.getBoundingClientRect();
        const stepRect = step.getBoundingClientRect();
        setIsTakeawayStepVisible(
          stepRect.right > containerRect.left + SCROLL_EDGE_THRESHOLD_PX &&
            stepRect.left < containerRect.right - SCROLL_EDGE_THRESHOLD_PX,
        );
      } else {
        setIsTakeawayStepVisible(false);
      }
    } else {
      setIsTakeawayStepVisible(false);
    }

    updateConnector();
  }, [lastCompletedIndex, lastCompletedTakeaway, updateConnector]);

  const scrollByPage = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const delta = container.clientWidth * SCROLL_PAGE_RATIO * (direction === "left" ? -1 : 1);
    container.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  useLayoutEffect(() => {
    itemRefs.current[focusIndex]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [focusIndex]);

  useLayoutEffect(() => {
    updateConnector();
  }, [updateConnector, goals]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollEdges();

    const resizeObserver = new ResizeObserver(updateScrollEdges);
    resizeObserver.observe(container);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [goals.length, updateScrollEdges]);

  return (
    <div ref={containerRef} className="relative min-w-0">
      {connector ? (
        <div
          aria-hidden
          className="bg-primary pointer-events-none absolute z-0 w-1 -translate-x-1/2"
          style={{ left: connector.left, top: connector.top, height: connector.height }}
        />
      ) : null}

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
              "from-card pointer-events-none absolute top-0 left-0 z-10 h-12 w-8 bg-gradient-to-r to-transparent transition-opacity duration-200",
              canScrollStart ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "from-card pointer-events-none absolute top-0 right-0 z-10 h-12 w-8 bg-gradient-to-l to-transparent transition-opacity duration-200",
              canScrollEnd ? "opacity-100" : "opacity-0",
            )}
          />

          <div
            ref={scrollRef}
            role="list"
            aria-label="Goal progress"
            className="relative z-[1] flex snap-x snap-mandatory items-center gap-2 overflow-x-auto overflow-y-hidden scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={updateScrollEdges}
          >
            {goals.map((goal, index) => {
              const hasTakeaway = Boolean(goal.takeaway.trim());

              const completedButton = (
                <button
                  ref={(node) => setItemRef(index, node)}
                  type="button"
                  role="listitem"
                  className={cn(
                    GOAL_ITEM_CLASS,
                    "bg-muted relative size-8 cursor-default overflow-hidden rounded-full border-0 p-0",
                  )}
                  aria-label={`Goal ${index + 1} completed`}
                  onMouseEnter={
                    hasTakeaway
                      ? () => {
                          cancelScheduledClose();
                          setOpenIndex(index);
                        }
                      : undefined
                  }
                  onMouseLeave={hasTakeaway ? scheduleClose : undefined}
                >
                  {hasTakeaway ? <ShineBorder shineColor={TAKEAWAY_SHINE_COLORS} borderWidth={2} /> : null}
                  <Lottie
                    animationData={hasTakeaway ? checkpointAnimationData : completeAnimationData}
                    loop={false}
                    autoplay={true}
                    className="pointer-events-none absolute inset-0 size-full scale-[1.90]"
                  />
                </button>
              );

              return goal.isCompleted ? (
                hasTakeaway ? (
                  <Popover
                    key={index}
                    modal={false}
                    open={openIndex === index}
                    onOpenChange={(open) => handlePopoverOpenChange(open, index)}
                  >
                    <PopoverTrigger asChild>{completedButton}</PopoverTrigger>
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
                        <p className="text-primary flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                          <BookOpen className="size-3.5 shrink-0" aria-hidden />
                          Why Important?
                        </p>
                        <p className="text-sm font-medium">{goal.takeaway}</p>
                      </PopoverHeader>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Fragment key={index}>{completedButton}</Fragment>
                )
              ) : (
                <div
                  key={index}
                  ref={(node) => setItemRef(index, node)}
                  role="listitem"
                  className={cn(
                    GOAL_ITEM_CLASS,
                    "relative grid size-8 place-items-center rounded-full text-xs font-bold",
                    activeGoalIndex === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                  aria-label={`Goal ${index + 1}`}
                  aria-current={activeGoalIndex === index ? "step" : undefined}
                >
                  {hasTakeaway ? <ShineBorder shineColor={TAKEAWAY_SHINE_COLORS} borderWidth={2} /> : null}
                  {index + 1}
                </div>
              );
            })}
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

      {showTakeaway && lastCompletedTakeaway ? (
        <div
          ref={takeawayCardRef}
          className="card-border-bottom-shadow relative z-[1] mt-6 flex-row items-center gap-4 p-3"
        >
          <Image src={bookIcon} alt="" width={80} height={80} className="size-12 shrink-0 object-contain" />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-sm font-bold">Checkpoint Importance</p>
            <p className="text-muted-foreground leading-snug text-pretty">{lastCompletedTakeaway.takeaway}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
