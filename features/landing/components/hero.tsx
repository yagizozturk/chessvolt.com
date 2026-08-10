"use client";

import { ChessKnight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
        <div className="order-2 flex flex-1 flex-col items-center space-y-6 text-center md:order-1 md:items-end md:text-right">
          <h1 className="w-full text-center text-[clamp(1.5rem,2.8vw+0.5rem,4.5rem)] leading-tight font-extrabold tracking-tighter md:text-right">
            Understand <br className="hidden md:block" />
            <span className="text-primary decoration-foreground/20 underline underline-offset-8 md:text-[clamp(2.25rem,4vw+1rem,6rem)]">
              Why
            </span>{" "}
            <br className="hidden md:block" /> And Repeat
          </h1>
          <p className="text-foreground w-full text-center text-[clamp(0.95rem,1.4vw+0.5rem,1.25rem)] leading-relaxed md:text-right">
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
