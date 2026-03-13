import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllGameRiddles } from "@/features/game-riddle/services/game-riddle";
import { getGamesByIds } from "@/features/game/services/game";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import {
  formatGameType,
  getGameTypeCopy,
  gameTypeToSlug,
} from "@/features/game-riddle/utilities/game-type-copy";
import { groupBy } from "@/lib/utilities/groupBy";
import { CollectionHeader } from "@/components/collection/collection-header";
import { ProgressStatsCard } from "@/components/stats/progress-stats-card";
import { PuzzleCard } from "@/components/puzzle-card/puzzle-card";
import * as userGameRiddleRepo from "@/features/game-riddle/repository/user-game-riddle.repository";
import { getGroupStats } from "@/features/game-riddle/utilities/get-group-stats";

export default async function ChallengePage() {
  // ========================================================================
  // Getting user data and riddles for games
  // ========================================================================
  const { user, supabase } = await getAuthenticatedUser();
  const [allRiddles, attemptedRiddles] = await Promise.all([
    getAllGameRiddles(supabase),
    userGameRiddleRepo.findGameRiddleAttempts(supabase, user.id),
  ]);

  // ========================================================================
  // Mapping. FromEntries example return: { "riddle-101": true }
  // ========================================================================
  const attemptByRiddleId = Object.fromEntries(
    attemptedRiddles.map((a) => [a.gameRiddleId, a.isCorrect]),
  );

  // ========================================================================
  // Grouping data by gameType in riddles. (gameType is required; filter legacy nulls)
  // ========================================================================
  const riddlesWithGameType = allRiddles.filter((r) => r.gameType?.trim());
  const riddleGameTypeGroups = groupBy(riddlesWithGameType, (r) =>
    r.gameType!.trim(),
  );

  const groupKeys = Object.keys(riddleGameTypeGroups);

  // ========================================================================
  // Fetch games for riddles (unique gameIds) - single query
  // new Set(...) eliminates same values. [... ] converts it to array
  // ========================================================================
  const gameIds = [...new Set(allRiddles.map((r) => r.gameId))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-12 pb-16">
      {groupKeys.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          No challenges added yet. Coming soon!
        </div>
      ) : (
        <div className="space-y-6">
          {groupKeys.map((gameType) => {
            const riddles = riddleGameTypeGroups[gameType] ?? [];
            const slug = gameTypeToSlug(gameType);
            const displayName = formatGameType(gameType);
            const copy = getGameTypeCopy(gameType);
            const stats = getGroupStats(riddles, attemptByRiddleId);

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

                        return (
                          <PuzzleCard
                            key={riddle.id}
                            riddle={riddle}
                            game={game}
                            num={num}
                            width={200}
                            height={200}
                          />
                        );
                      })}
                  </div>
                  <ProgressStatsCard
                    percentage={stats.percentage}
                    className="m-4 mt-14"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
