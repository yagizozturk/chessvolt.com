"use client";

import Lottie from "lottie-react";
import { BookmarkCheck, BookmarkX } from "lucide-react";

import solvedAnimationData from "@/public/images/animations/animation-complete.json";
import wrongAnimationData from "@/public/images/animations/animation-warning-yellow.json";

type BoardStatusIconProps = {
  status: "solved" | "wrong";
};

export function BoardStatusIcon({ status }: BoardStatusIconProps) {
  if (status === "solved") {
    return (
      <div className={`absolute top-[-7px] right-2 z-10`}>
        <BookmarkCheck className="h-10 w-10 fill-emerald-100 text-emerald-500" />
      </div>
    );
  }
  return (
    <div className={`absolute top-[-7px] right-2 z-10`}>
      <BookmarkX className="h-10 w-10 text-red-500" />
    </div>
  );
}
