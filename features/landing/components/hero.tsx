import { ChessQueen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#5137AC] pt-16">
      <div className="absolute inset-0 z-0" />
      <div className="relative container mx-auto px-4 md:px-6">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-end space-y-8 text-right">
            <div className="text-foreground space-y-6">
              <h1 className="text-4xl leading-tight font-extrabold tracking-tighter sm:text-6xl lg:text-7xl/none">
                Master The{" "}
                <span className="text-primary decoration-foreground/20 underline underline-offset-8">Why</span> <br />{" "}
                Behind Moves
                <br /> With Fun
              </h1>
              <p className="text-foreground text-xl leading-relaxed">
                Sharpen your skills through engaging riddles and openings designed to help you predict GM moves and
                opening repertoires.
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
          <div className="relative mt-8 flex justify-start lg:mt-0">
            <Image
              src="/images/hero/landing_page_9.png"
              alt="ChessVolt Dashboard Preview"
              width={600}
              height={600}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
