"use client";

import Lottie from "lottie-react";

type ImageInfoCardProps = {
  animationData: object;
  title: string;
  description: string;
};

export function ImageInfoCard({ animationData, title, description }: ImageInfoCardProps) {
  return (
    <div className="bg-muted/50 flex gap-4 rounded-xl p-4">
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        <Lottie animationData={animationData} loop={false} autoplay={true} className="size-full" />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
