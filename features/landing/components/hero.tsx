"use client";

import { ChessKnight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { TwoColCard } from "@/components/two-col-card/two-col-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { cn } from "@/lib/utils";

export function Hero() {
  const { profile, isLoading } = useProfile();
  const [isNavigating, setIsNavigating] = useState(false);
  const cta = profile ? { href: "/dashboard", label: "Start Playing" } : { href: "/login", label: "Start Learning" };

  return (
    <div className="container mx-auto px-4 pt-32 pb-16 md:px-6">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="order-2 flex flex-1 flex-col items-center gap-6 text-center md:order-1 md:items-end md:text-right">
          <h2 className="w-full text-center text-2xl leading-tight font-extrabold tracking-tighter text-neutral-100 md:text-right md:text-6xl">
            Repeat & Master <br /> Your <span className="text-primary">Blunders</span>
          </h2>
          <p className="w-full text-center text-xl leading-relaxed text-neutral-300 md:text-right">
            Learn openings, solve puzzles, play real famous games, <br /> and train with interactive chess games that{" "}
            <br />
            aims to teach you the idea behind the moves.
          </p>
          <div className="flex gap-4">
            <TwoColCard
              imageSrc="/images/form/chess-com-pawn-logo.png"
              imageAlt="Chess.com"
              text="Import your Chess.com games"
              className="rounded-xl border-1 border-[#5638ea] bg-[#5434e2]"
            />
            <TwoColCard
              imageSrc="/images/form/lichess-logo.png"
              imageAlt="Chess.com"
              text="Play your lichess.org games"
              className="rounded-xl border-1 border-[#5638ea] bg-[#5434e2]"
            />
          </div>
          {!isLoading && (
            <div className="flex w-full justify-center md:justify-end">
              <Button variant="volt" asChild>
                <Link
                  href={cta.href}
                  aria-busy={isNavigating}
                  onClick={() => setIsNavigating(true)}
                  className={cn("flex items-center gap-2", isNavigating && "pointer-events-none")}
                >
                  {isNavigating ? <Spinner data-icon="inline-start" /> : <ChessKnight className="h-4 w-4" />}
                  {cta.label}
                </Link>
              </Button>
            </div>
          )}
        </div>
        <div className="order-1 flex-1 md:order-2 md:mt-[-50px]">
          <Image
            src="/images/hero/bg-volt-coach-playing-chess.png"
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
