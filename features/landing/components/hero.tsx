"use client";

import { ChessKnight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { Spinner } from "@/components/ui/spinner";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { cn } from "@/lib/utils";

export function Hero() {
  const { profile, isLoading } = useProfile();
  const [isNavigating, setIsNavigating] = useState(false);
  const cta = profile ? { href: "/dashboard", label: "Start Playing" } : { href: "/login", label: "Start Learning" };

  return (
    <div className="container mx-auto bg-[#5734B3] px-4 pt-32 pb-16 md:px-6">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="order-2 flex flex-1 flex-col items-center gap-6 text-center md:order-1 md:items-end md:text-right">
          <h1 className="w-full text-center text-2xl leading-tight font-extrabold tracking-tighter md:text-right md:text-6xl">
            Connect Your <br className="hidden md:block" />
            <Image
              src="/images/hero/hero-account-logo.png"
              alt="Chess.com and Lichess"
              width={900}
              height={240}
              className="mt-[-20px] inline-block h-auto w-72 align-middle md:w-[32rem]"
            />{" "}
            accounts to practice your &nbsp;
            <Highlighter action="highlight" color="#FE8B14">
              blunders
            </Highlighter>
          </h1>
          <p className="text-foreground w-full text-center text-xl leading-relaxed md:text-right">
            Learn openings, solve puzzles, play real famous games, <br /> and train with interactive chess games that{" "}
            <br />
            aims to teach you the idea behind the moves.
          </p>
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
