import { ChessQueen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="container mx-auto bg-[#5734B3] px-4 pt-16 md:px-6">
      <div className="relative mr-16 flex justify-end lg:mt-0">
        <Image
          src="/images/hero/landing-page-12.png"
          alt="ChessVolt Dashboard Preview"
          width={1000}
          height={565}
          quality={90}
        />
        <div className="absolute top-0 left-0 flex flex-col space-y-8 text-right" style={{ left: "80px", top: "70px" }}>
          <div className="text-foreground space-y-6">
            <h1 className="text-4xl leading-tight font-extrabold tracking-tighter sm:text-6xl lg:text-7xl/none">
              Master The <span className="text-primary decoration-foreground/20 underline underline-offset-8">Why</span>{" "}
              <br /> Behind Moves
              <br /> With Fun
            </h1>
            <p className="text-foreground text-xl leading-relaxed">
              Sharpen your skills through engaging
              <br /> riddles and openings designed to help you predict <br /> GM moves and opening repertoires.
            </p>
          </div>
          <div className="flex w-full flex-wrap justify-end">
            <Button variant="volt" size="lg" asChild>
              <Link href="/challenge">
                Start Playing <ChessQueen className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
