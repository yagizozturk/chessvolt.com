"use client";

import { ArrowsUpFromLine, BookOpenText, Swords } from "lucide-react";

import { FeatureItem } from "@/features/landing/components/featute-item";

const sharedFeatures = [
  {
    title: "Replay Memorable Games",
    description: "Replay famous chess games and find the masters' moves. Learn to think like grandmasters.",
    icon: BookOpenText,
    imageSrc: "/images/cards/bg-opening-crusher-game.png",
    imageAlt: "Replay memorable chess games",
  },
  {
    title: "Structured Challenges",
    description: "Work through puzzles by game type and theme. Pick up where you left off.",
    icon: Swords,
    imageSrc: "/images/cards/bg-masters-game.png",
    imageAlt: "Structured chess challenges",
  },
  {
    title: "Opening Position Drawer",
    description: "Deepen your game knowledge with built-in move explanations in every game.",
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
