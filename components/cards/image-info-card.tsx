"use client";

import Lottie from "lottie-react";
import { ArrowsUpFromLine } from "lucide-react";

import { cn } from "@/lib/utils";
import animationData from "@/public/images/animations/animation-complete.json";

type ImageInfoCardProps = {
  iconColor: string;
  title: string;
  description: string;
  isComplete?: boolean;
};

export function ImageInfoCard({ iconColor, title, description, isComplete = false }: ImageInfoCardProps) {
  return (
    <div
      className={cn(
        "bg-muted/50 flex w-full flex-col gap-2 rounded-2xl px-4 py-2 transition-opacity",
        isComplete && "opacity-40",
      )}
    >
      <div className="flex items-center gap-4">
        <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
          <ArrowsUpFromLine className="size-8 shrink-0" style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold">{title}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <div className="size-20">
          {isComplete ? (
            <Lottie animationData={animationData} loop={false} autoplay={true} className="size-full" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
