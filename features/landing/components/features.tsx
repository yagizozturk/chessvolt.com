"use client";

import { Puzzle, Swords, Zap } from "lucide-react";

import { FeatureItem } from "@/features/landing/components/featute-item";

const sharedFeatures = [
  {
    title: "Solve Riddles & Repeat",
    description: "Learn opening plans by drawing arrows that reveal where your pieces should go and why.",
    icon: Puzzle,
    imageSrc: "/images/cards/bg-arrows-game.png",
    imageAlt: "Move explanations while you play",
  },
  {
    title: "Earn max 220 Volt in 5 days",
    description:
      "Master openings by solving key positions again and again, while learning the reason behind every move.",
    icon: Zap,
    imageSrc: "/images/cards/bg-earn-volt.png",
    imageAlt: "Earn up to 220 Volt in any 5 days",
  },
  {
    title: "Reach Your Target Rating",
    description: "By practicing, you can reach your target rating and become a master of chess.",
    icon: Swords,
    imageSrc: "/images/cards/bg-masters-game.png",
    imageAlt: "Reach Your Target Rating",
  },
];

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
              Understand Why And Repeat
            </h2>
            <p className="text-foreground/80 mx-auto max-w-2xl text-lg leading-relaxed">
              <span className="text-primary font-medium">Solve riddles</span> to learn opening plans, earn up to{" "}
              <span className="text-primary font-medium">220 Volt</span> in five days, and practice your way to your
              target rating.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-10 lg:flex-row">
            {sharedFeatures.map((feature) => (
              <FeatureItem
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                imageSrc={feature.imageSrc}
                imageAlt={feature.imageAlt}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
