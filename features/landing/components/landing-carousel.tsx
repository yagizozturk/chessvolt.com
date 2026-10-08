import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const slides = [
  {
    title: "Turn Your Chess Mistakes into Progress",
    description:
      "Import your Chess.com or Lichess games and discover where you went wrong. Replay critical positions and practice finding better moves.",
    imageSrc: "/images/cards/bg-arrows-game.png",
    imageAlt: "Turn Your Chess Mistakes into Progress",
  },
  {
    title: "Learn Chess Openings with Spaced Repetition",
    description:
      "Practice opening variations move by move. Revisit them across different days to build a repertoire you can recall when it matters.",
    imageSrc: "/images/cards/bg-earn-volt.png",
    imageAlt: "Learn Chess Openings with Spaced Repetition",
  },
  {
    title: "Your Next Practice, Already Saved",
    description:
      "Keep mistakes, opening variations, and chess puzzles together in Volt Tracker. Return to your saved content and follow each item’s Volt Score.",
    imageSrc: "/images/cards/bg-masters-game.png",
    imageAlt: "Your Next Practice, Already Saved",
  },
];

export function LandingCarousel() {
  return (
    <section className="w-full bg-[#FDFDFD] px-4 py-20 md:px-6">
      <Carousel opts={{ loop: true }} className="mx-auto max-w-4xl">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.title}>
              <div className="my-20 flex flex-col items-center gap-8 rounded-xl bg-[#3e1dad] p-10 md:flex-row">
                <div className="flex flex-1 flex-col items-center gap-4 text-center md:items-start md:text-left">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-100 md:text-4xl">{slide.title}</h2>
                  <p className="text-lg leading-relaxed text-neutral-300">{slide.description}</p>
                  <Button variant="volt" asChild>
                    <Link href="/login">Start Learning</Link>
                  </Button>
                </div>
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  width={224}
                  height={224}
                  className="size-56 shrink-0 rounded-xl object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant="secondary" />
        <CarouselNext variant="secondary" />
      </Carousel>
    </section>
  );
}
