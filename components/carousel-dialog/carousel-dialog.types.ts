import type { ReactNode } from "react";

export type CarouselDialogSlide = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: ReactNode;
};
