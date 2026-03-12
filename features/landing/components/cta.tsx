import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChessQueen } from "lucide-react";

export function Cta() {
  return (
    <section className="bg-background relative w-full overflow-hidden py-16 lg:py-20">
      <div className="bg-primary/5 absolute inset-0" />
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 text-primary mb-6 flex h-20 w-20 items-center justify-center rounded-2xl lg:h-24 lg:w-24">
            <ChessQueen className="h-10 w-10 lg:h-12 lg:w-12" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Level Up?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-[500px] text-lg leading-relaxed">
            Start playing now and sharpen your chess skills with our engaging
            mini-games.
          </p>
          <Button
            variant="default"
            size="lg"
            className="mt-8 h-12 px-8 text-base"
            asChild
          >
            <Link href="/challenge/legend_games">
              Start Playing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
