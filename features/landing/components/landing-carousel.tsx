import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const slides = [
  {
    title: "Solve Openings, Puzzles & Repeat",
    description: "Solve a puzzle, then play it again. A few repeats in a row is the fastest way for the idea to stick.",
    imageSrc: "/images/cards/bg-arrows-game.png",
    imageAlt: "Move explanations while you play",
  },
  {
    title: "Earn max 220 Volt in 4 days",
    description:
      "Your Volt Score shows how well you remember each puzzle or opening. You can earn up to 220 Volt across any 4 days, with a daily max of 55.",
    imageSrc: "/images/cards/bg-earn-volt.png",
    imageAlt: "Earn up to 220 Volt in any 4 days",
  },
  {
    title: "Reach Your Target Rating",
    description:
      "Keep training the games and puzzles you want to master. Steady practice is how you climb toward the rating you set.",
    imageSrc: "/images/cards/bg-masters-game.png",
    imageAlt: "Reach your target rating",
  },
];

export function LandingCarousel() {
  return (
    <section className="w-full bg-white px-4 py-20 md:px-6">
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
