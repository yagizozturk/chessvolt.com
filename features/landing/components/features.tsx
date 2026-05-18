"use client";

import { ArrowsUpFromLine, BookOpenText, Swords } from "lucide-react";

import { FeatureItem } from "@/features/landing/components/featute-item";

const sharedFeatures = [
  {
    title: "Play The Opening Crusher",
    description:
      "Master openings by solving key positions again and again, while learning the reason behind every move.",
    icon: BookOpenText,
    imageSrc: "/images/cards/bg-opening-crusher-game.png",
    imageAlt: "Replay memorable chess games",
  },
  {
    title: "Solve Riddles From Real Games",
    description: "Play through key moments from real chess games and discover the idea behind the winning move.",
    icon: Swords,
    imageSrc: "/images/cards/bg-masters-game.png",
    imageAlt: "Structured chess challenges",
  },
  {
    title: "Play The Arrows Game",
    description: "Learn opening plans by drawing arrows that reveal where your pieces should go and why.",
    icon: ArrowsUpFromLine,
    imageSrc: "/images/cards/bg-arrows-game.png",
    imageAlt: "Move explanations while you play",
  },
];

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex gap-10">
          {sharedFeatures.map((feature, i) => (
            <FeatureItem
              key={i + 1}
              index={i + 1}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
