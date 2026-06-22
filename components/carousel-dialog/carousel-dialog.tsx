"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import type { CarouselDialogSlide } from "@/components/carousel-dialog/carousel-dialog.types";
import { Button } from "@/components/ui/button";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";

export type CarouselDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: CarouselDialogSlide[];
  /** When false, hides Skip and places Back (voltMuted) on the left. Default: true. */
  showSkip?: boolean;
};

export function CarouselDialog({
  open,
  onOpenChange,
  slides,
  showSkip = true,
}: CarouselDialogProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slideCount = slides.length;
  const activeSlide = slides[current];
  const isFirstSlide = current === 0;
  const isLastSlide = current === slideCount - 1;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!open) {
      setCurrent(0);
      api?.scrollTo(0, true);
    }
  }, [api, open]);

  const handleSkip = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      onOpenChange(false);
      return;
    }

    api?.scrollNext();
  }, [api, isLastSlide, onOpenChange]);

  const handleBack = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  if (!activeSlide) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} />
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">{activeSlide.title}</DialogTitle>
        </DialogHeader>

        <Carousel setApi={setApi} opts={{ loop: false }} className="w-full">
          <CarouselContent className="-ml-2">
            {slides.map((slide) => (
              <CarouselItem key={slide.title} className="pl-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 512px"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current ? "step" : undefined}
              className={cn("size-2 rounded-full transition-colors", index === current ? "bg-primary" : "bg-muted")}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <DialogDescription className="text-center text-lg text-pretty">{activeSlide.description}</DialogDescription>
        </div>

        <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
          {showSkip ? (
            <Button type="button" variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
          ) : !isFirstSlide ? (
            <Button type="button" variant="voltMuted" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2 sm:ml-auto">
            {showSkip && !isFirstSlide ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : null}
            <Button type="button" variant="volt" onClick={handleNext}>
              {isLastSlide ? "Got it" : "Next"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
