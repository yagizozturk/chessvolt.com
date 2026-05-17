"use client";

import { useEffect, useRef } from "react";
import { EVENTS, STATUS, useJoyride, type Props, type Step } from "react-joyride";

import {
  DEFAULT_PRODUCT_TOUR_JOYRIDE,
  getProductTourStorageKey,
} from "@/lib/shared/hooks/tour/product-tour-config";

type ProductTourJoyrideOverrides = Omit<Partial<Props>, "steps">;

export type UseProductTourParams = {
  tourId: string;
  steps: Step[];
  scopeId?: string;
  autoStart?: boolean;
  joyrideOverrides?: ProductTourJoyrideOverrides;
};

export function useProductTour({
  tourId,
  steps,
  scopeId,
  autoStart = true,
  joyrideOverrides,
}: UseProductTourParams) {
  const storageKey = getProductTourStorageKey(tourId);
  const isInitialScopeRef = useRef(true);

  const { controls, on, Tour } = useJoyride({
    ...DEFAULT_PRODUCT_TOUR_JOYRIDE,
    ...joyrideOverrides,
    steps,
    options: {
      ...DEFAULT_PRODUCT_TOUR_JOYRIDE.options,
      ...joyrideOverrides?.options,
    },
    locale: {
      ...DEFAULT_PRODUCT_TOUR_JOYRIDE.locale,
      ...joyrideOverrides?.locale,
    },
    styles: {
      ...DEFAULT_PRODUCT_TOUR_JOYRIDE.styles,
      ...joyrideOverrides?.styles,
    },
  });

  useEffect(() => {
    if (!autoStart || typeof window === "undefined") return;
    if (localStorage.getItem(storageKey)) return;

    const frameId = requestAnimationFrame(() => {
      controls.start();
    });

    return () => cancelAnimationFrame(frameId);
  }, [autoStart, controls, storageKey]);

  useEffect(() => {
    return on(EVENTS.TOUR_END, (data) => {
      if (data.status !== STATUS.FINISHED && data.status !== STATUS.SKIPPED) return;
      localStorage.setItem(storageKey, "1");
    });
  }, [on, storageKey]);

  useEffect(() => {
    if (scopeId == null) return;

    if (isInitialScopeRef.current) {
      isInitialScopeRef.current = false;
      return;
    }

    controls.stop();
  }, [scopeId, controls]);

  return {
    Tour,
    startTour: controls.start,
    stopTour: controls.stop,
  };
}
