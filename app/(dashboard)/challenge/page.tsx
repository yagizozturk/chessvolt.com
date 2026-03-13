import Link from "next/link";
import { ChevronRight, Target } from "lucide-react";
import { getAllGameRiddles } from "@/features/game-riddle/services/game-riddle";
import { getGameById } from "@/features/game/services/game";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import {
  formatGameType,
  getGameTypeCopy,
  gameTypeToSlug,
} from "@/lib/shared/constants/game-type-copy";
import { shuffle } from "@/lib/utilities/shuffle";
import { CollectionHeader } from "@/components/collection/collection-header";
import { Card } from "@/components/ui/card";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";
import * as userGameRiddleRepo from "@/features/game-riddle/repository/user-game-riddle.repository";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";

// ======================================================================
// Grouping Riddles by game type column value
// ======================================================================
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

export default async function ChallengePage() {
  // Getting data
  const { user, supabase } = await getAuthenticatedUser();
  const [allRiddles, attemptedRiddles] = await Promise.all([
    getAllGameRiddles(supabase),
    userGameRiddleRepo.findAttemptedGameRiddleAttempts(supabase, user.id),
  ]);

  const groups = groupRiddlesByGameType(allRiddles);
  const attemptByRiddleId = Object.fromEntries(
    attemptedRiddles.map((a) => [a.gameRiddleId, a.isCorrect]),
  );

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
    <div className="container mx-auto max-w-6xl px-4 pt-12 pb-16">
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
            const completed = riddles.filter(
              (r) => attemptByRiddleId[r.id] === true,
            ).length;
            const total = riddles.length;
            const percentage =
              total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div key={gameType} className="overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-2 py-3">
                  <CollectionHeader
                    title={displayName}
                    imageSrc="/images/challanges/magnus_plays.png"
                    imageAlt={displayName}
                    description={copy.description}
                    quote={copy.quote}
                    author={copy.author}
                    itemCount={riddles.length}
                    itemLabel="riddles"
                  />
                  <Link
                    href={`/challenge/${slug}`}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    See All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex">
                  <div className="grid grid-cols-4 gap-6 px-2 py-3">
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
                  <Card className="m-4 mt-14 w-44 shrink-0 self-start p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                        <Target className="text-primary h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground text-xs">
                          Finished riddles
                        </p>
                        <p className="text-xl font-bold">{percentage}%</p>
                      </div>
                    </div>
                    <div className="bg-muted mt-3 h-2 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
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
