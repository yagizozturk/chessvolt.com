import Link from "next/link";
import { Map, ChevronRight, Sword, Circle } from "lucide-react";
import { getAllGameRiddles } from "@/features/game-riddle/services/game-riddle";
import { getGameById } from "@/features/game/services/game";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { Badge } from "@/components/ui/badge";
import PuzzleBoard from "@/features/puzzle/components/puzzle-board";
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

/** Fisher-Yates shuffle - returns new array with random order */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export default async function ChallengePage() {
  const { supabase } = await getAuthenticatedUser();

  const allRiddles = await getAllGameRiddles(supabase);
  const groups = groupRiddlesByGameType(allRiddles);

  // Shuffle each group and take max 6 riddles per group
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
    <div className="container mx-auto max-w-5xl px-6 pt-12 pb-16">
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

            return (
              <div key={gameType} className="overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-semibold">
                      {displayName}
                      <Badge variant="default" className="font-normal">
                        {riddles.length} riddles
                      </Badge>
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Master the tactics in this collection.
                    </p>
                  </div>
                  <Link
                    href={`/challenge/${slug}`}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    See All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  {riddles
                    .filter((r) => gameMap[r.gameId]?.pgn)
                    .slice(0, 6)
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
                        <Link
                          key={riddle.id}
                          href={`/game-riddle/${riddle.id}`}
                          className="group flex flex-col"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex shrink-0 items-baseline gap-0.5">
                              <span
                                className={`text-sm font-medium ${numColorClass}`}
                              >
                                #
                              </span>
                              <span
                                className={`text-4xl font-bold ${numColorClass}`}
                              >
                                {num}
                              </span>
                            </span>
                            <p className="truncate text-lg">{riddle.title}</p>
                          </div>
                          <div className="group/board relative mt-2 inline-flex justify-center">
                            <PuzzleBoard
                              sourceId={riddle.id}
                              mode="riddle"
                              pgn={game.pgn}
                              ply={riddle.ply}
                              moves={riddle.moves ?? ""}
                              width={280}
                              height={280}
                              className="border-muted rounded-xl border-4"
                              viewOnly
                            />
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/60 opacity-0 transition-opacity duration-200 group-hover/board:opacity-100">
                              <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
                                <Sword className="text-primary-foreground h-7 w-7" />
                              </div>
                              <span className="font-semibold text-white">
                                Play
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-center">
                            <div className="flex items-center gap-2 px-3 py-1.5">
                              <Circle className="stroke-border h-3.5 w-3.5 fill-white" />
                              <span className="max-w-[110px] truncate text-sm font-medium">
                                {game.whitePlayer}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-sm font-medium">
                              vs
                            </span>
                            <div className="flex items-center gap-2 px-3 py-1.5">
                              <span className="max-w-[110px] truncate text-sm font-medium">
                                {game.blackPlayer}
                              </span>
                              <Circle className="fill-primary stroke-primary h-3.5 w-3.5" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
