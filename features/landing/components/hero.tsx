import Image from "next/image";

export function Hero() {
  return (
    <div className="container mx-auto bg-[#5734B3] px-4 pt-32 pb-24 md:px-6">
      <div className="flex gap-8">
        <div className="flex flex-1 flex-col items-end space-y-6 text-right">
          <h1 className="text-3xl leading-tight font-extrabold tracking-tighter sm:text-6xl lg:text-7xl/none">
            Understand <br />
            <span className="text-primary decoration-foreground/20 text-8xl underline underline-offset-8">
              Why
            </span>{" "}
            <br /> And Repeat
          </h1>
          <p className="text-foreground text-xl leading-relaxed">
            Learn openings, solve riddles from real famous games, <br /> and train with interactive chess games that{" "}
            <br />
            teach you the idea behind every move.
          </p>
        </div>
        <div className="mt-[-50px] flex-1">
          <Image src="/images/hero/bg-hero-volt-play.png" alt="ChessVolt Dashboard Preview" width={963} height={800} />
        </div>
      </div>
    </div>
  );
}
