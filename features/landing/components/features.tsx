import Image from "next/image";

const steps: { imageSrc: string; imageAlt: string; title: string; description: string }[] = [
  {
    imageSrc: "/images/volt-explain/how_to_step_1.png",
    imageAlt: "Connect your chess.com and lichess.org accounts",
    title: "Turn Your Mistakes into Practice",
    description:
      "Import your games using your Chess.com or Lichess username. Discover where you went wrong, revisit those positions, and try to find the best move yourself.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_2.png",
    imageAlt: "Volt coaching you while you practice chess",
    title: "Explore Openings, Puzzles & Studies",
    description:
      "Practice opening variations, challenge yourself with chess puzzles, and work through curated studies. Choose what you want to improve and learn by playing through positions.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_3.png",
    imageAlt: "Adding a game to Volt Tracker",
    title: "Build Your Volt Tracker",
    description:
      "Save games, opening variations, puzzles, and studies to your personal practice collection. Keep the things you want to revisit together, ready for your next session.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_4.png",
    imageAlt: "How Volt Score measures memory with the forgetting curve",
    title: "Return, Repeat & Improve",
    description:
      "Come back to saved items on different days. Revisit tricky positions, practice what you have learned, and build each item’s Volt Score as you go.",
  },
];

export function Features() {
  return (
    <section aria-labelledby="how-chessvolt-helps" className="bg-zinc-50 py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-10">
          <header className="mx-auto max-w-3xl text-center">
            <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-zinc-600 uppercase sm:text-xs">
              <span aria-hidden="true" className="bg-primary h-2 w-2 rounded-full" />
              YOUR PERSONAL CHESS PRACTICE
            </p>
            <h2
              id="how-chessvolt-helps"
              className="tracking-light text-4xl leading-none font-semibold text-zinc-900 sm:text-5xl lg:text-6xl"
            >
              More ways to practice. More chances to <span className="text-primary">improve</span>
            </h2>
            <p className="mx-auto mt-5 mb-0 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
              Learn from your own games or explore something new. ChessVolt brings game analysis, opening training,
              puzzles, and curated studies into one place.
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
                <h3 className="mt-4 text-center text-xl font-bold tracking-tight text-zinc-900">{step.title}</h3>
                <p className="text-center text-base leading-relaxed text-zinc-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
