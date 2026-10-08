import React, { type ReactNode } from "react";

import type { CarouselDialogSlide } from "@/components/carousel-dialog/carousel-dialog.types";

export const VOLT_EXPLAIN_DIALOG_ID = "study-intro";

// ── First-view persistence (localStorage) ────────────────────────────────────
// These helpers gate *automatic* display only. They do NOT block intentional opens
// (e.g. sidebar "How Volt Works"). Once the user dismisses the dialog, we write "1"
// so auto-start never fires again — but openDialog() can still show it any time.

export function getVoltExplainDialogStorageKey(dialogId: string) {
  return `volt-explain-dialog-seen:${dialogId}`;
}

/** True when the user has already completed or skipped the intro for this dialogId. */
export function hasSeenVoltExplainDialog(dialogId: string) {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(getVoltExplainDialogStorageKey(dialogId)) === "1";
}

/** Called when the dialog closes (Skip, Got it, or overlay dismiss). */
export function markVoltExplainDialogSeen(dialogId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getVoltExplainDialogStorageKey(dialogId), "1");
}

/** Dev/admin helper — clears the seen flag so auto-start can run again. */
export function clearVoltExplainDialogSeen(dialogId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getVoltExplainDialogStorageKey(dialogId));
}

/** Default slides — replace images and copy for your feature. */
export const DEFAULT_VOLT_EXPLAIN_DIALOG_SLIDES: CarouselDialogSlide[] = [
  {
    imageSrc: "/images/volt-explain/slide-1.png",
    imageAlt: "Volt with Hermann Ebbinghaus and a forgetting curve chart",
    title: "Why Repetition Matters",
    description: [
      "ChessVolt's approach to practice is inspired by ",
      <span key="ebbinghaus" className="text-primary font-medium">
        Hermann Ebbinghaus
      </span>,
      " and his work on the ",
      <span key="forgetting-curve" className="text-primary font-medium">
        forgetting curve
      </span>,
      ". Revisit the same positions across different days to reinforce what you learn and practice recalling the moves.",
    ] satisfies ReactNode,
  },
  {
    imageSrc: "/images/volt-explain/slide-2-3.png",
    imageAlt: "A diagram showing memory retention reinforced by repeated practice",
    title: "What Your Volt Score Shows",
    description: [
      "Your ",
      <span key="volt-score" className="text-primary font-medium">
        Volt Score
      </span>,
      " reflects your recent practice performance for each item. It adds up the points from your ",
      <span key="scored-days" className="text-primary font-medium">
        four most recent practice days
      </span>,
      " within the ",
      <span key="lookback" className="text-primary font-medium">
        last three months
      </span>,
      ". These days do not need to be consecutive. Your score can rise or fall as new practice days replace older ones or earlier results leave this window.",
    ] satisfies ReactNode,
  },
  {
    imageSrc: "/images/volt-explain/slide-3a.png",
    imageAlt: "Volt Score showing accuracy, timing, streak, and four days of practice",
    title: "How to Earn Up to 220 Volt",
    description: [
      "Each attempt is scored on ",
      <span key="metrics" className="text-primary font-medium">
        accuracy (60%), timing (30%), and streak (10%)
      </span>,
      ". Streak means your longest run of correct moves within that attempt. Only your ",
      <span key="counted-attempts" className="text-primary font-medium">
        first three attempts per item each day
      </span>,
      " count, weighted ",
      <span key="attempt-weights" className="text-primary font-medium">
        50%, 30%, and 20%
      </span>,
      ". All three are needed to reach the daily maximum of ",
      <span key="day-max-volt" className="text-primary font-medium">
        55 Volt
      </span>,
      ". Across the four counted days, each item's score can reach ",
      <span key="max-volt" className="text-primary font-medium">
        220 Volt
      </span>,
      ".",
    ] satisfies ReactNode,
  },
];
