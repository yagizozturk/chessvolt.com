import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllGameRiddles } from "@/features/game-riddle/services/game-riddle";
import { getGameById } from "@/features/game/services/game";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { shuffle } from "@/lib/utilities/shuffle";
import { Badge } from "@/components/ui/badge";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";

function groupRiddlesByGameType(
  riddles: GameRiddle[],
): Record<string, GameRiddle[]> {
  const groups: Record<string, GameRiddle[]> = {};

  for (const riddle of riddles) {
    const gameType = riddle.gameType?.trim() || "uncategorized";
    if (!groups[gameType]) groups[gameType] = [];
    groups[gameType].push(riddle);
  }

  // Sort riddles within each group by ply
  for (const key of Object.keys(groups)) {
    groups[key].sort((a: GameRiddle, b: GameRiddle) => a.ply - b.ply);
  }

  return groups;
}

function formatGameType(slug: string): string {
  return slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function gameTypeToSlug(gameType: string): string {
  return gameType.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
}

type GameTypeCopy = {
  description: string;
  quote: string;
  author: string;
};

const GAME_TYPE_COPY: Record<string, GameTypeCopy> = {
  legend_games: {
    description:
      "Replay historic games from chess legends. Find their moves and learn to think.",
    quote: "Chess is life in miniature.",
    author: "Garry Kasparov",
  },
  opening_crusher: {
    description:
      "Master your repertoire with Opening Crusher. Step into the shoes of the greats and dominate from move one.",
    quote:
      "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.",
    author: "Rudolf Spielmann",
  },
};

const DEFAULT_COPY: GameTypeCopy = {
  description:
    "Master the tactics in this collection and sharpen your chess intuition.",
  quote: "Chess is the gymnasium of the mind.",
  author: "Blaise Pascal",
};

function getGameTypeCopy(gameType: string): GameTypeCopy {
  return GAME_TYPE_COPY[gameType] ?? DEFAULT_COPY;
}

export default async function ChallengePage() {
  const { supabase } = await getAuthenticatedUser();
  const allRiddles = await getAllGameRiddles(supabase);
  const groups = groupRiddlesByGameType(allRiddles);

  // Shuffle each group and take max 4 riddles per group
  const shuffledGroups: Record<string, GameRiddle[]> = {};
  for (const key of Object.keys(groups)) {
    shuffledGroups[key] = shuffle(groups[key]!);
  }

  // Fetch games for riddles (unique gameIds)
  const gameIds = [...new Set(allRiddles.map((r) => r.gameId))];
  const games = await Promise.all(
    gameIds.map((id) => getGameById(supabase, id)),
  );
  const gameMap = Object.fromEntries(
    games
      .filter((g): g is NonNullable<typeof g> => g != null)
      .map((g) => [g.id, g]),
  );

  // Filter out uncategorized if empty or sort: put uncategorized last
  const sortedGroupKeys = Object.keys(groups).sort((a: string, b: string) => {
    if (a === "uncategorized") return 1;
    if (b === "uncategorized") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-12 pb-16">
      {sortedGroupKeys.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          No challenges added yet. Coming soon!
        </div>
      ) : (
        <div className="space-y-6">
          {sortedGroupKeys.map((gameType) => {
            const riddles = shuffledGroups[gameType] ?? [];
            const slug = gameTypeToSlug(gameType);
            const displayName = formatGameType(gameType);
            const copy = getGameTypeCopy(gameType);

            return (
              <div key={gameType} className="overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/challanges/magnus_plays.png"
                      alt={displayName}
                      width={156}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1 space-y-2">
                      <h2 className="flex items-center gap-2 text-2xl font-semibold">
                        {displayName}
                        <Badge variant="default" className="font-normal">
                          {riddles.length} riddles
                        </Badge>
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {copy.description}
                      </p>
                      <blockquote className="border-primary/30 border-l-2 pl-3">
                        <p className="text-muted-foreground italic">
                          &ldquo;{copy.quote}&rdquo;
                        </p>
                        <cite className="text-muted-foreground/80 mt-0.5 block text-xs not-italic">
                          — {copy.author}
                        </cite>
                      </blockquote>
                    </div>
                  </div>
                  <Link
                    href={`/challenge/${slug}`}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    See All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex">
                  <div className="grid grid-cols-4 gap-6 p-4">
                    {riddles
                      .filter((r) => gameMap[r.gameId]?.pgn)
                      .slice(0, 4)
                      .map((riddle, index) => {
                        const game = gameMap[riddle.gameId]!;
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
                            key={riddle.id}
                            riddle={riddle}
                            game={game}
                            num={num}
                            numColorClass={numColorClass}
                          />
                        );
                      })}
                  </div>
                  <div>test</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
