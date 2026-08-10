import Image from "next/image";

const steps = [
  {
    imageSrc: "/images/volt-explain/how_to_step1.png",
    imageAlt: "Chess puzzle board",
    title: "Play Openings, Solve Puzzles",
    description:
      "Solve puzzles, play curated studies, practice old famous games. In learn mode, Volt will help you learn the openings and ideas for the long term.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step2.png",
    imageAlt: "Volt Tracker Button",
    title: "Volt Tracker Button",
    description:
      "Add games you want to focus and improve to your Volt Tracker with a button on the top right of the game panel. Your Volt Score will be visible in Volt Tracker page.",
  },
  {
    imageSrc: "/images/volt-explain/how_to_step3_8.png",
    imageAlt: "How Volt Score Is Calculated",
    title: "How Volt Score Is Calculated",
    description:
      "Volt Score repetition theory is based on Hermann Ebbinghaus's forgetting curve. It analyzes your performance on accuracy (60%), timing (30%), and streak (10%) in a game. Play 5 days in last 3 months to get max Volt Score.",
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
          <div className="flex flex-col gap-16 lg:grid lg:grid-cols-3 lg:grid-rows-[auto_auto_auto] lg:gap-x-8 lg:gap-y-4">
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
