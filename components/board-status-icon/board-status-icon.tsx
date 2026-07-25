// TODO: Refactor
"use client";

import Lottie from "lottie-react";

import solvedAnimationData from "@/public/images/animations/animation-complete.json";
import wrongAnimationData from "@/public/images/animations/animation-warning-yellow.json";

type BoardStatusIconProps = {
  status: "solved" | "wrong";
};

export function BoardStatusIcon({ status }: BoardStatusIconProps) {
  if (status === "solved") {
    return (
      <div className={`absolute top-[-10px] right-[-10px] z-10`}>
        <Lottie animationData={solvedAnimationData} loop={false} autoplay className="h-20 w-20" />
      </div>
    );
  }
  return (
    <div className={`absolute top-3 right-3 z-10`}>
      <Lottie animationData={wrongAnimationData} loop autoplay className="h-12 w-12" />
    </div>
  );
}
