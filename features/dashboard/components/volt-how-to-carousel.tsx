"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    imageSrc: "/images/volt-explain/how_to_step_1.png",
    imageAlt: "A player importing Chess.com and Lichess games for analysis",
    title: "Import and analyze your chess games",
    description:
      "Enter your Chess.com or Lichess username to import and analyze your games. ChessVolt highlights your mistakes and lets you replay those positions, giving you a chance to find better moves and learn from situations you have actually faced.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_2.png",
    imageAlt: "Volt Coach guiding a player through chess practice",
    title: "Practice openings, puzzles, and chess ideas",
    description:
      "Explore opening variations, solve chess puzzles, and work through curated studies and famous games. Volt Coach guides you through the ideas behind the moves as you practice. Revisit the same material over time to strengthen your understanding and make important patterns easier to recall.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_3.png",
    imageAlt: "A player saving chess content to Volt Tracker",
    title: "Save what you want to practice in Volt Tracker",
    description:
      "Use the Volt button at the top right of the game panel to save a mistake from your games, an opening variation, or a puzzle to Volt Tracker. Your saved content stays within easy reach for future practice. Each item has its own Volt Score, so you can follow your recent performance and decide what to revisit.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_4.png",
    imageAlt: "A forgetting curve chart and a 220 Volt score",
    title: "Repeat, remember, and track your progress",
    description:
      "Inspired by Hermann Ebbinghaus's work on the forgetting curve, ChessVolt encourages practice across different days. Each item's Volt Score reflects recent practice performance, up to 220 Volt. It combines your four most recent practice days within the last three months, with up to 55 Volt per day. These days do not need to be consecutive. Scores combine accuracy (60%), timing (30%), and your longest run of correct moves within an attempt (10%). Only your first three attempts per item each day count, weighted 50%, 30%, and 20%. All three are needed to reach the daily maximum.",
  },
] as const;

export function VoltHowToCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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

  return (
    <div className="card-border-bottom-shadow p-6">
      <Carousel setApi={setApi} opts={{ loop: false }} className="w-full">
        <CarouselContent className="-ml-0">
          {SLIDES.map((slide, index) => (
            <CarouselItem key={slide.title} className="pl-0">
              <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
                <div className="relative aspect-square w-full max-w-64 shrink-0">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 80vw, 256px"
                    priority={index === 0}
                  />
                </div>
                <div className="flex flex-col gap-2 text-center md:text-left">
                  <p className="text-muted-foreground text-sm font-medium">
                    Step {index + 1} of {SLIDES.length}
                  </p>
                  <h2 className="sub-section-header-title">{slide.title}</h2>
                  <p className="text-muted-foreground text-sm md:text-base">{slide.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-6 flex items-center justify-center gap-4">
          <CarouselPrevious className="static translate-none" />
          <div className="flex gap-2">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === current ? "step" : undefined}
                className={cn(
                  "size-2 rounded-full transition-colors",
                  index === current ? "bg-primary" : "bg-muted-foreground/30",
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
          <CarouselNext className="static translate-none" />
        </div>
      </Carousel>
    </div>
  );
}
