import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="container mx-auto bg-[#5734B3] px-4 pt-32 md:px-6">
      <div className="flex gap-2">
        <div className="flex flex-1 flex-col items-end space-y-6 text-right">
          <h1 className="text-3xl leading-tight font-extrabold tracking-tighter sm:text-6xl lg:text-7xl/none">
            Understand <br />
            <span className="text-primary decoration-foreground/20 text-8xl underline underline-offset-8">
              Why
            </span>{" "}
            <br /> Behind Moves
          </h1>
          <p className="text-foreground text-xl leading-relaxed">
            Learn openings, solve riddles from real famous games, <br /> and train with interactive chess games that{" "}
            <br />
            teach you the idea behind every move.
          </p>
          <div className="flex w-full flex-wrap justify-end">
            <Button variant="volt" size="lg" asChild>
              <Link href="/collection">Start Playing</Link>
            </Button>
          </div>
        </div>
        <div className="mt-[-50px] flex-1">
          <Image src="/images/hero/bg-landing-page.png" alt="ChessVolt Dashboard Preview" width={600} height={503} />
        </div>
      </div>
    </div>
  );
}
