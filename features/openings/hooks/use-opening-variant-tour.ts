"use client";

import { useEffect, useRef } from "react";
import { EVENTS, STATUS, useJoyride } from "react-joyride";

const TOUR_SEEN_STORAGE_KEY = "opening-variant-tour-seen";

const STEPS = [
  {
    target: '[data-tour="board"]',
    title: "Play on the board",
    content: "Make the move shown in the goals. Wrong moves are rejected.",
    placement: "right" as const,
    skipBeacon: true,
  },
  {
    target: '[data-tour="goals"]',
    title: "Your objectives",
    content: "Each card is a step in the line. Complete them in order.",
    placement: "left" as const,
  },
  {
    target: '[data-tour="hint-button"]',
    title: "Hints",
    content: "You get up to two hints per step if you are stuck.",
    placement: "top" as const,
  },
  {
    target: '[data-tour="progress"]',
    title: "Progress",
    content: "Track how far you are through this variant.",
    placement: "left" as const,
  },
];

type UseOpeningVariantTourParams = {
  variantId: string;
};

export function useOpeningVariantTour({ variantId }: UseOpeningVariantTourParams) {
  const isInitialVariantRef = useRef(true);

  const { controls, on, Tour } = useJoyride({
    continuous: true,
    scrollToFirstStep: true,
    steps: STEPS,
    options: {
      showProgress: true,
      skipBeacon: true,
      primaryColor: "oklch(0.852 0.199 91.936)",
      overlayColor: "rgba(0, 0, 0, 0.8)",
    },
    locale: {
      last: "Got it",
      skip: "Skip tour",
    },
    styles: {
      buttonPrimary: {
        border: "none",
        outline: "none",
        boxShadow: "none",
        borderRadius: 8,
        fontSize: 14,
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
      },
      buttonBack: { border: "none", outline: "none", borderRadius: 8, fontSize: 14, color: "var(--primary)" },
      buttonSkip: { border: "none", outline: "none", borderRadius: 8, fontSize: 14, color: "var(--primary)" },
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(TOUR_SEEN_STORAGE_KEY)) return;

    const frameId = requestAnimationFrame(() => {
      controls.start();
    });

    return () => cancelAnimationFrame(frameId);
  }, [controls]);

  useEffect(() => {
    return on(EVENTS.TOUR_END, (data) => {
      if (data.status !== STATUS.FINISHED && data.status !== STATUS.SKIPPED) return;
      localStorage.setItem(TOUR_SEEN_STORAGE_KEY, "1");
    });
  }, [on]);

  useEffect(() => {
    if (isInitialVariantRef.current) {
      isInitialVariantRef.current = false;
      return;
    }

    controls.stop();
  }, [variantId, controls]);

  return {
    Tour,
    startTour: controls.start,
    stopTour: controls.stop,
  };
}
