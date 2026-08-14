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
    imageSrc: "/images/volt-explain/how_to_step1.png",
    imageAlt: "Volt coaching you while you practice chess",
    title: "Play openings and solve puzzles",
    description:
      "Start by solving puzzles, training openings, and playing curated studies or famous games. Volt coaches you through the ideas as you go, so you are not just guessing moves — you are learning why they work. The more you practice the same material, the more those patterns stay with you.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step2.png",
    imageAlt: "Adding a game to Volt Tracker",
    title: "Add games to Volt Tracker",
    description:
      "When you find an opening or puzzle you want to master, tap the Volt button on the top right of the game panel to add it to Volt Tracker. That is how ChessVolt knows which content to score. Your Volt Score for each item then appears on the Volt Tracker page, so you can see what you know well and what still needs review.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step3_8.png",
    imageAlt: "How Volt Score measures memory with the forgetting curve",
    title: "Volt tracks what you remember",
    description:
      "Volt Score is built on Hermann Ebbinghaus's forgetting curve: it measures how well you remember each piece of content, not just whether you got it right once. Scoring weights accuracy (60%), timing (30%), and streak (10%). You can earn up to 220 Volt across any 4 days in the last 3 months, with a daily max of 55. Only your first 3 practices each day count, and repeating the same game a few times in a row is the fastest way to raise your score.",
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
