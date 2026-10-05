"use client";

import Lottie from "lottie-react";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import loaderAnimationData from "@/public/images/animations/animation-loading.json";

type GameAnalysisStatusProps = {
  message: string | null;
};

export function GameAnalysisStatus({ message }: GameAnalysisStatusProps) {
  if (!message) return null;

  return (
    <div className="flex shrink-0 flex-col items-center gap-3" role="status" aria-live="polite">
      <div className="text-muted-foreground flex items-center justify-center gap-3 text-sm">
        <Lottie
          animationData={loaderAnimationData}
          loop
          autoplay
          aria-hidden="true"
          className="bg-foreground/90 border-primary size-28 shrink-0 rounded-full border border-5"
        />
      </div>
      <div className="px-4 text-center text-base">
        <AnimatedShinyText>
          <span className="text-white">{message}</span>
        </AnimatedShinyText>
      </div>
    </div>
  );
}
