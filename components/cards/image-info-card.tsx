"use client";

import { Check } from "lucide-react";
import Lottie from "lottie-react";

import { cn } from "@/lib/utils";

type ImageInfoCardProps = {
  animationData: object;
  title: string;
  description: string;
  isComplete?: boolean;
};

export function ImageInfoCard({ animationData, title, description, isComplete = false }: ImageInfoCardProps) {
  return (
    <div
      className={cn(
        "bg-muted/50 flex w-full gap-4 rounded-xl p-4 transition-opacity",
        isComplete && "opacity-80",
      )}
    >
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        <Lottie animationData={animationData} loop={false} autoplay={true} className="size-full" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
              <Check className="size-4" strokeWidth={3} />
            </span>
          ) : null}
          <p className="text-lg font-semibold">{title}</p>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
