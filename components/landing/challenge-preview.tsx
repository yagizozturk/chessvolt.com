import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, BookOpen, Trophy, Lock, Map } from "lucide-react";
import Link from "next/link";

export function ChallengePreview() {
  const levels = [
    {
      id: 1,
      type: "complete",
      icon: <Check className="h-6 w-6" />,
      offset: "0",
    },
    {
      id: 2,
      type: "current",
      icon: <BookOpen className="h-6 w-6" />,
      offset: "40px",
      label: "Magnus Carlsen vs Fabiano Caruana",
    },
    {
      id: 3,
      type: "locked",
      icon: <Star className="h-6 w-6" />,
      offset: "70px",
    },
    {
      id: 4,
      type: "locked",
      icon: <BookOpen className="h-6 w-6" />,
      offset: "40px",
    },
    {
      id: 5,
      type: "locked",
      icon: <Lock className="h-6 w-6" />,
      offset: "-10px",
    },
    {
      id: 6,
      type: "locked",
      icon: <Trophy className="h-6 w-6" />,
      offset: "-50px",
    },
  ];

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-12 text-center">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex gap-2 rounded-full px-6 py-2 text-base backdrop-blur-md [&_svg]:size-5"
            >
              <Map />
              Roadmap
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Your Learning Challenge
            </h2>
            <p className="text-muted-foreground mt-2">
              Continue where you left off and earn new badges.
            </p>
          </div>

          <div className="relative flex w-full max-w-[400px] flex-col items-center gap-8">
            {levels.map((level) => (
              <div
                key={level.id}
                className="relative transition-transform hover:scale-110"
                style={{ transform: `translateX(${level.offset})` }}
              >
                {/* Mevcut Seviye Etiketi */}
                {level.type === "current" && (
                  <Badge className="bg-primary text-secondary absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce px-3 py-1">
                    {level.label}
                  </Badge>
                )}

                {/* Seviye Butonu */}
                <Button
                  size="icon"
                  className={`h-16 w-16 rounded-full border-b-4 transition-all active:border-b-0 ${
                    level.type === "complete"
                      ? "border-orange-700 bg-orange-400 hover:bg-orange-500"
                      : level.type === "current"
                        ? "border-orange-800 bg-orange-500 shadow-xl hover:bg-orange-600"
                        : "pointer-events-none border-slate-400 bg-slate-200 text-slate-400"
                  }`}
                >
                  {level.icon}
                </Button>
              </div>
            ))}

            {/* Background path line (optional) */}
            <div className="absolute top-0 bottom-0 -z-10 w-1 rounded-full bg-slate-100" />
          </div>

          <div className="mt-16">
            <Button variant="outline" size="lg" asChild>
              <Link href="/challenge">View Full Map</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
