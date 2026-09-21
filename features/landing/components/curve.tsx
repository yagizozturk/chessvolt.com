import Image from "next/image";

const steps = [
  {
    imageSrc: "/images/volt-explain/how_to_step_1.png",
    imageAlt: "Connect your chess.com and lichess.org accounts",
    title: "Connect Your Accounts",
    description:
      "Connect your Chess.com and Lichess accounts so ChessVolt can learn from your games and turn key mistakes into practice positions.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_2.png",
    imageAlt: "Volt coaching you while you practice chess",
    title: "Practice Chess Patterns",
    description:
      "Solve puzzles, train openings, and play curated studies or famous games while Volt coaches you through the ideas.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_3.png",
    imageAlt: "Adding a game to Volt Tracker",
    title: "Add Items To Volt Tracker",
    description:
      "Use the Volt button on a game panel to add content you want to master, then track its score on the Volt Tracker page.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step_4.png",
    imageAlt: "How Volt Score measures memory with the forgetting curve",
    title: "Build Long-Term Memory",
    description:
      "Volt Score uses the forgetting curve to measure how well you remember each item across accuracy, timing, and streak.",
  },
];

export function Curve() {
  return (
    <section className="bg-mist-100 py-30">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-secondary text-3xl font-extrabold tracking-tight sm:text-4xl">
              How ChessVolt Helps You Practice
            </h2>
            <p className="text-secondary/80 mx-auto max-w-2xl text-lg leading-relaxed">
              ChessVolt is built on the{" "}
              <span className="text-primary font-medium">forgetting curve of Hermann Ebbinghaus</span>. First 3
              repetition will be the most effective, so we recommend you to play the same game 3 times in a row. These
              repetitions will increase your Volt Score.
            </p>
          </div>
          <div className="flex flex-col gap-16 lg:grid lg:grid-cols-4 lg:grid-rows-[auto_auto_auto] lg:gap-x-6 lg:gap-y-4">
            {steps.map((step) => (
              <div key={step.title} className="flex flex-col gap-4 lg:row-span-3 lg:grid lg:grid-rows-subgrid">
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
                <p className="text-secondary/80 text-center text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
