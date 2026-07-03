import Image from "next/image";

export function Hero() {
  return (
    <div className="container mx-auto bg-[#5734B3] px-4 pt-32 pb-24 md:px-6">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="order-2 flex flex-1 flex-col items-center space-y-6 text-center md:order-1 md:items-end md:text-right">
          <h1 className="w-full text-center text-[clamp(1.5rem,2.8vw+0.5rem,4.5rem)] leading-tight font-extrabold tracking-tighter md:text-right">
            Understand <br className="hidden md:block" />
            <span className="text-primary decoration-foreground/20 underline underline-offset-8 md:text-[clamp(2.25rem,4vw+1rem,6rem)]">
              Why
            </span>{" "}
            <br className="hidden md:block" /> And Repeat
          </h1>
          <p className="text-foreground w-full text-center text-[clamp(0.95rem,1.4vw+0.5rem,1.25rem)] leading-relaxed md:text-right">
            Learn openings, solve riddles, play real famous games, <br /> and train with interactive chess games that{" "}
            <br />
            aims to teach you the idea behind the moves.
          </p>
        </div>
        <div className="order-1 flex-1 md:order-2 md:mt-[-50px]">
          <Image
            src="/images/hero/bg-hero-volt-play.png"
            alt="ChessVolt Dashboard Preview"
            width={963}
            height={800}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
