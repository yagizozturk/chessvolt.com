"use client";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";

import { AnimationPreview } from "./animation-preview";

export type AnimationFile = {
  name: string;
  src: string;
};

type Props = {
  animations: AnimationFile[];
};

export function AnimationsList({ animations }: Props) {
  if (animations.length === 0) {
    return <EmptyDataMessage message="No Lottie JSON files found." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {animations.map((animation) => (
        <AnimationPreview key={animation.src} name={animation.name} src={animation.src} />
      ))}
    </div>
  );
}
