import Link from "next/link";
import { ChevronLeft, Target } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getRepsByOpeningType } from "@/features/reps/services/reps";
import { GAME_TYPE_QUOTES } from "@/lib/shared/constants/quote";
import {
  formatOpeningType,
  slugToOpeningType,
} from "@/lib/shared/constants/opening-type-copy";
import { CollectionHeader } from "@/components/collection/collection-header";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";
import { Card, CardContent } from "@/components/ui/card";
import type { Rep } from "@/features/reps/types/reps";

function repToRiddleAndGame(rep: Rep) {
  return {
    riddle: {
      id: rep.id,
      gameId: rep.id,
      ply: rep.ply ?? 0,
      title: rep.title || "Untitled Repertoire",
      moves: rep.moves,
      gameType: null,
      createdAt: rep.createdAt,
    },
    game: {
      id: rep.id,
      pgn: rep.pgn ?? "",
      whitePlayer: rep.openingName ?? "White",
      blackPlayer: "Black",
      result: "",
      playedAt: "",
      url: null,
      createdAt: rep.createdAt,
      event: null,
      opening: rep.openingName,
      description: null,
    },
  };
}

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function RepsByOpeningPage({ params }: Params) {
  const { slug } = await params;
  const { supabase } = await getAuthenticatedUser();

  const openingType = slugToOpeningType(slug);
  const reps = await getRepsByOpeningType(supabase, openingType);
  const repsWithPgn = reps.filter((r) => r.pgn);

  const openingQuote = GAME_TYPE_QUOTES.opening_crusher ?? {
    quote:
      "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.",
    author: "Rudolf Spielmann",
  };

  const displayName = formatOpeningType(openingType);

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        <div>
          <Link
            href="/reps"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Repertoires
          </Link>
          <div className="mb-8 flex items-center justify-between gap-4 px-2 py-3">
            <CollectionHeader
              title={`${displayName} Repertoires`}
              imageSrc="/images/challanges/magnus_plays.png"
              imageAlt={displayName}
              description="Study and practice your opening repertoires. Build your arsenal and dominate from move one."
              quote={openingQuote.quote}
              author={openingQuote.author}
              itemCount={reps.length}
              itemLabel={reps.length === 1 ? "repertoire" : "repertoires"}
            />
          </div>

          {repsWithPgn.length === 0 ? (
            <Card className="border-border bg-card/50 border-dashed">
              <CardContent className="text-muted-foreground py-12 text-center">
                No repertoires in this opening type yet. Coming soon!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {repsWithPgn.map((rep, index) => {
                const num = index + 1;
                const numColorClasses = [
                  "text-primary",
                  "text-chart-2",
                  "text-chart-4",
                  "text-chart-1",
                  "text-chart-3",
                  "text-chart-5",
                ];
                const numColorClass =
                  numColorClasses[index % 6] ?? numColorClasses[0];

                return (
                  <RepCard
                    key={rep.id}
                    rep={rep}
                    num={num}
                    numColorClass={numColorClass}
                    width={220}
                    height={220}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card className="w-44 shrink-0 self-start p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Target className="text-primary h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs">Repertoires</p>
                <p className="text-xl font-bold">{reps.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
