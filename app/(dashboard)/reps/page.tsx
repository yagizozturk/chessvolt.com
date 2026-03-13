import Link from "next/link";
import { ChevronRight, Target } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getAllReps } from "@/features/reps/services/reps";
import { GAME_TYPE_QUOTES } from "@/lib/shared/constants/quote";
import {
  formatOpeningType,
  openingTypeToSlug,
} from "@/lib/shared/constants/opening-type-copy";
import { shuffle } from "@/lib/utilities/shuffle";
import { CollectionHeader } from "@/components/collection/collection-header";
import { Card } from "@/components/ui/card";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";
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

function groupRepsByOpeningType(reps: Rep[]): Record<string, Rep[]> {
  const groups: Record<string, Rep[]> = {};

  for (const rep of reps) {
    const openingType = rep.openingType?.trim() || "uncategorized";
    if (!groups[openingType]) groups[openingType] = [];
    groups[openingType].push(rep);
  }

  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (a.ply ?? 0) - (b.ply ?? 0));
  }

  return groups;
}

export default async function RepsPage() {
  const { supabase } = await getAuthenticatedUser();
  const reps = await getAllReps(supabase);
  const repsWithPgn = reps.filter((r) => r.pgn);

  const groups = groupRepsByOpeningType(repsWithPgn);
  const shuffledGroups: Record<string, Rep[]> = {};
  for (const key of Object.keys(groups)) {
    shuffledGroups[key] = shuffle(groups[key]!);
  }

  const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
    if (a === "uncategorized") return 1;
    if (b === "uncategorized") return -1;
    return a.localeCompare(b);
  });

  const openingQuote = GAME_TYPE_QUOTES.opening_crusher ?? {
    quote:
      "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.",
    author: "Rudolf Spielmann",
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-12 pb-16">
      {reps.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          No repertoires yet.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedGroupKeys.map((openingType) => {
            const groupReps = shuffledGroups[openingType] ?? [];
            const slug = openingTypeToSlug(openingType);
            const displayName = formatOpeningType(openingType);

            return (
              <div key={openingType} className="overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-2 py-3">
                  <CollectionHeader
                    title={displayName}
                    imageSrc="/images/challanges/magnus_plays.png"
                    imageAlt={displayName}
                    description="Study and practice your opening repertoires. Build your arsenal and dominate from move one."
                    quote={openingQuote.quote}
                    author={openingQuote.author}
                    itemCount={groupReps.length}
                    itemLabel={
                      groupReps.length === 1 ? "repertoire" : "repertoires"
                    }
                  />
                  <Link
                    href={`/reps/opening/${slug}`}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    See All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex">
                  <div className="grid grid-cols-2 gap-6 px-2 py-3 sm:grid-cols-4">
                    {groupReps.slice(0, 4).map((rep, index) => {
                      const { riddle, game } = repToRiddleAndGame(rep);
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
                        <PuzzleCard
                          key={rep.id}
                          riddle={riddle}
                          game={game}
                          num={num}
                          numColorClass={numColorClass}
                          href={`/reps/${rep.id}`}
                          initialFen={rep.displayFen}
                        />
                      );
                    })}
                  </div>
                  <Card className="m-4 mt-14 w-44 shrink-0 self-start p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                        <Target className="text-primary h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground text-xs">
                          Repertoires
                        </p>
                        <p className="text-xl font-bold">{groupReps.length}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
