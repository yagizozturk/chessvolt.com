"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type MoveNavigatorControlsProps = {
  currentPly: number;
  totalPly: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose?: () => void;
  enableKeyboard?: boolean;
  className?: string;
};

export function MoveNavigatorControls({
  currentPly,
  totalPly,
  onPrevious,
  onNext,
  onClose,
  enableKeyboard = true,
  className = "",
}: MoveNavigatorControlsProps) {
  const canGoPrevious = currentPly > 0;
  const canGoNext = currentPly < totalPly;

  useEffect(() => {
    if (!enableKeyboard) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      event.preventDefault();

      if (event.key === "ArrowLeft" && canGoPrevious) onPrevious();
      if (event.key === "ArrowRight" && canGoNext) onNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, canGoPrevious, canGoNext, onPrevious, onNext]);

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Button variant="voltIcon" onClick={onPrevious} disabled={!canGoPrevious} aria-label="Previous move">
        <ChevronLeft className="size-5" />
      </Button>

      <span className="text-muted-foreground text-sm font-medium">
        {currentPly} / {totalPly}
      </span>

      <Button variant="voltIcon" onClick={onNext} disabled={!canGoNext} aria-label="Next move">
        <ChevronRight className="size-5" />
      </Button>

      {onClose ? (
        <Button variant="voltRed" onClick={onClose} aria-label="Close navigator">
          <X className="size-5" />
        </Button>
      ) : null}
    </div>
  );
}
