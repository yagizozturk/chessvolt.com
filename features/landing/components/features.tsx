import Image from "next/image";

const steps: { imageSrc: string; imageAlt: string; title: string; description: string }[] = [
  {
    imageSrc: "/images/volt-explain/how_to_step_1.png",
    imageAlt: "Connect your chess.com and lichess.org accounts",
    title: "Import Your Games",
    description:
      "Enter your Chess.com or Lichess username to import and analyze your games. Discover mistakes you can turn into practice.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_2.png",
    imageAlt: "Volt coaching you while you practice chess",
    title: "Practice Key Positions",
    description:
      "Replay your mistakes, explore chess openings, and solve puzzles. Practice finding better moves, one position at a time.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_3.png",
    imageAlt: "Adding a game to Volt Tracker",
    title: "Save To Volt Tracker",
    description:
      "Save mistakes, opening variations, and puzzles for quick access. Build your own collection of content to revisit.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_4.png",
    imageAlt: "How Volt Score measures memory with the forgetting curve",
    title: "Repeat & Track Progress",
    description:
      "Practice across different days to strengthen your recall. Track your recent practice performance with up to 220 Volt for each item.",
  },
];

export function Features() {
  return (
    <section aria-labelledby="how-chessvolt-helps" className="bg-[#F0ECF5] py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-10">
          <header className="mx-auto max-w-3xl text-center">
            <p className="mb-4 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-[#6c5d88] uppercase sm:text-xs">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#ffd04b]" />
              How it works
            </p>
            <h2
              id="how-chessvolt-helps"
              className="text-muted m-0 text-[42px] leading-[1.08] font-semibold tracking-[-0.045em] sm:text-[64px] lg:text-[72px]"
            >
              ChessVolt helps you <span className="text-primary">improve</span>
            </h2>
            <p className="text-muted mx-auto mt-5 mb-0 max-w-xl text-sm leading-7 sm:text-base">
              Inspired by <span className="text-primary font-medium">Hermann Ebbinghaus&apos;s</span> work on the{" "}
              <span className="text-primary font-medium">forgetting curve</span>, ChessVolt encourages you to revisit
              what you learn and practice across different days.
            </p>
          </header>
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
                <h3 className="text-secondary mt-4 text-center text-2xl font-bold tracking-tight">{step.title}</h3>
                <p className="text-center text-lg leading-relaxed text-zinc-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
