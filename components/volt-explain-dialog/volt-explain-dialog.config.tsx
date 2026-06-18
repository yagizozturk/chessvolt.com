import React, { type ReactNode } from "react";

import type { CarouselDialogSlide } from "@/components/carousel-dialog/carousel-dialog.types";

export function getVoltExplainDialogStorageKey(dialogId: string) {
  return `volt-explain-dialog-seen:${dialogId}`;
}

export function hasSeenVoltExplainDialog(dialogId: string) {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(getVoltExplainDialogStorageKey(dialogId)) === "1";
}

export function markVoltExplainDialogSeen(dialogId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getVoltExplainDialogStorageKey(dialogId), "1");
}

export function clearVoltExplainDialogSeen(dialogId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getVoltExplainDialogStorageKey(dialogId));
}

/** Default slides — replace images and copy for your feature. */
export const DEFAULT_VOLT_EXPLAIN_DIALOG_SLIDES: CarouselDialogSlide[] = [
  {
    imageSrc: "/images/volt-explain/slide-1.png",
    imageAlt: "Chess puzzle board",
    title: "Introducing Hermann Ebbinghaus",
    description:
      "He was a German psychologist who studied memory and learning. He is best known for his work on the forgetting curve. ChessVolt is using his work to help you learn chess.",
  },
  {
    imageSrc: "/images/volt-explain/slide-2-3.png",
    imageAlt: "The Forgetting Curve",
    title: "The Forgetting Curve",
    description: [
      "ChessVolt is designed to help you repeat the material you learn. The more you repeat, the more you remember. We are tracking your progress with a ",
      <span key="volt-score" className="text-primary font-medium">
        Volt Score
      </span>,
      ". The higher the score, the better you remember the material.",
    ] satisfies ReactNode,
  },
  {
    imageSrc: "/images/volt-explain/slide-3.png",
    imageAlt: "Track your progress",
    title: "Track your progress",
    description: "Earn Volt points, build streaks, and revisit collections as you improve.",
  },
];
