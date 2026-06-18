import React, { type ReactNode } from "react";

import type { CarouselDialogSlide } from "@/components/carousel-dialog/carousel-dialog.types";

export const VOLT_EXPLAIN_DIALOG_ID = "collection-intro";

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
    description: [
      <span key="ebbinghaus" className="text-primary font-medium">
        Hermann Ebbinghaus
      </span>,
      " was a German psychologist who studied memory and learning. He is best known for his work on the ",
      <span key="forgetting-curve" className="text-primary font-medium">
        forgetting curve
      </span>,
      ". ChessVolt is using his work to help you learn chess.",
    ] satisfies ReactNode,
  },
  {
    imageSrc: "/images/volt-explain/slide-2-3.png",
    imageAlt: "The Forgetting Curve",
    title: "The Forgetting Curve",
    description: [
      "Your ",
      <span key="volt-score" className="text-primary font-medium">
        Volt Score
      </span>,
      " shows how well you remember each piece of content based on your performance over the ",
      <span key="lookback" className="text-primary font-medium">
        last 3 months
      </span>,
      ". The higher your score, the better you know it.",
    ] satisfies ReactNode,
  },
  {
    imageSrc: "/images/volt-explain/slide-3-1.png",
    imageAlt: "How Volt Score Is Calculated",
    title: "How Volt Score Is Calculated",
    description: [
      "Volt Score is based on accuracy (60%), timing (30%), and streak (10%). Earn up to ",
      <span key="max-volt" className="text-primary font-medium">
        220 Volt
      </span>,
      " across ",
      <span key="scored-days" className="text-primary font-medium">
        any 5 days
      </span>,
      " in the ",
      <span key="lookback" className="text-primary font-medium">
        last 3 months
      </span>,
      ", with a daily maximum of ",
      <span key="day-max-volt" className="text-primary font-medium">
        44 Volt
      </span>,
      ". Only your first 3 practices each day count: 1st practice 60%, 2nd 25%, and 3rd 15%.",
    ] satisfies ReactNode,
  },
];
