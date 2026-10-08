import Image from "next/image";
import type { ReactNode } from "react";

const steps: { imageSrc: string; imageAlt: string; title: ReactNode; description: string }[] = [
  {
    imageSrc: "/images/volt-explain/how_to_step_1.png",
    imageAlt: "Connect your chess.com and lichess.org accounts",
    title: (
      <>
        <span className="text-primary">Import </span>Your Games
      </>
    ),
    description:
      "Enter your Chess.com or Lichess username to import and analyze your games. Discover mistakes you can turn into practice.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_2.png",
    imageAlt: "Volt coaching you while you practice chess",
    title: (
      <>
        Practice <span className="text-primary">Key Positions</span>
      </>
    ),
    description:
      "Replay your mistakes, explore chess openings, and solve puzzles. Practice finding better moves, one position at a time.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_3.png",
    imageAlt: "Adding a game to Volt Tracker",
    title: (
      <>
        Save To <span className="text-primary">Volt Tracker</span>
      </>
    ),
    description:
      "Save mistakes, opening variations, and puzzles for quick access. Build your own collection of content to revisit.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_4.png",
    imageAlt: "How Volt Score measures memory with the forgetting curve",
    title: (
      <>
        Repeat & <span className="text-primary">Track Progress</span>
      </>
    ),
    description:
      "Practice across different days to strengthen your recall. Track your recent practice performance with up to 220 Volt for each item.",
  },
];

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl">
              How ChessVolt Helps You Improve
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-300">
              Inspired by <span className="text-primary font-medium">Hermann Ebbinghaus's</span> work on the{" "}
              <span className="text-primary font-medium">forgetting curve</span>, ChessVolt encourages you to revisit
              what you learn and practice across different days.
            </p>
          </div>
          <div className="flex flex-col gap-16 lg:grid lg:grid-cols-4 lg:grid-rows-[auto_auto_auto] lg:gap-x-6 lg:gap-y-4">
            {steps.map((step) => (
              <div key={step.imageSrc} className="flex flex-col gap-4 lg:row-span-3 lg:grid lg:grid-rows-subgrid">
                <div className="flex items-center justify-center overflow-hidden rounded-2xl">
                  <Image
                    src={step.imageSrc}
                    alt={step.imageAlt}
                    width={512}
                    height={512}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <h3 className="mt-4 text-center text-2xl font-bold tracking-tight text-neutral-100">{step.title}</h3>
                <p className="text-center text-lg leading-relaxed text-neutral-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
