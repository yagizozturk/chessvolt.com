"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utilities/cn";
import { ChessPawn, Puzzle, Map, Lightbulb, Swords } from "lucide-react";
import { MotionWrapper } from "./hero-content";

const sharedFeatures = [
  {
    title: "Replay Memorable Games",
    description:
      "Replay famous chess games and find the masters' moves. Learn to think like grandmasters.",
    badge: "Puzzle",
    icon: Puzzle,
  },
  {
    title: "Points & Streaks",
    description:
      "Earn points and build streaks as you correctly identify each move. Track your progress.",
    badge: "Challenge",
    icon: Map,
  },
  {
    title: "Move Explanations",
    description:
      "Deepen your game knowledge with built-in move explanations in every game.",
    badge: "Learning",
    icon: Lightbulb,
  },
];

const gameTypes = [
  {
    id: "opening-crusher",
    badge: "Game 1",
    badgeIcon: ChessPawn,
    title: "Opening Crusher",
    description:
      "Master your repertoire with Opening Crusher and step into the shoes of the greats with our Legend Games module.",
    image: "/images/features/landing_page_features_game_3.png",
    features: sharedFeatures,
  },
  {
    id: "legend-games",
    badge: "Game 2",
    badgeIcon: Swords,
    title: "Legend Games",
    description:
      "Replay historic games from chess legends. Find their moves and learn to think like the greatest players of all time.",
    image: "/images/features/landing_page_features_game_2.png",
    features: sharedFeatures,
  },
];

export function Features() {
  return (
    <section className="relative w-full overflow-visible py-20 lg:py-20">
      <div className="relative container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-12">
          {gameTypes.map((game, index) => {
            const imageOnLeft = index % 2 === 0;

            return (
              <div key={game.id} className="flex flex-col">
                {/* Başlık - her game için ortalı */}
                <div className="flex flex-col items-center text-center">
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex gap-2 rounded-full px-4 py-2 backdrop-blur-md [&_svg]:size-5"
                  >
                    <game.badgeIcon />
                    {game.badge}
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    {game.title}
                  </h2>
                  <p className="text-muted-foreground mx-auto mt-4 max-w-[600px] text-lg leading-relaxed md:text-xl">
                    {game.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "grid gap-12 py-20 lg:grid-cols-2 lg:items-center",
                    !imageOnLeft &&
                      "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
                  )}
                >
                  {/* Resim */}
                  <div
                    className={cn(
                      "relative flex justify-center",
                      imageOnLeft ? "lg:justify-start" : "lg:justify-end",
                    )}
                  >
                    <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 h-[100%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[50px]" />
                    <MotionWrapper delay={0.3} float={true}>
                      <Image
                        src={game.image}
                        alt={`${game.title} Preview`}
                        width={600}
                        height={400}
                        className="relative z-10 h-auto w-full max-w-[600px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        sizes="(max-width: 1024px) 100vw, 600px"
                      />
                    </MotionWrapper>
                  </div>

                  {/* Features içeriği */}
                  <div
                    className={cn(!imageOnLeft && "lg:flex lg:justify-start")}
                  >
                    <MotionWrapper
                      x={imageOnLeft ? 40 : -40}
                      className="lg:max-w-[500px]"
                    >
                      <ul className="flex w-full flex-col gap-6">
                        {game.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="group hover:border-primary/20 hover:bg-primary/5 flex gap-4 rounded-lg border border-transparent p-4 transition-all"
                          >
                            <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors [&_svg]:size-6">
                              <feature.icon />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="border-primary/20 bg-primary/10 text-primary w-fit gap-1 rounded-full px-3 py-0.5 text-xs backdrop-blur-md"
                                >
                                  {feature.badge}
                                </Badge>
                              </div>
                              <h3 className="font-semibold">{feature.title}</h3>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </MotionWrapper>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
