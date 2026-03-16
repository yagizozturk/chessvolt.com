import { CollectionHeader } from "@/components/collection/collection-header";
import { ProgressStatsCard } from "@/components/stats/progress-stats-card";
import { ChallengeDataList } from "@/features/challenge/components/challenge-data-list";
import * as userGameRiddleRepo from "@/features/game-riddle/repository/user-game-riddle.repository";
import { getAllGameRiddles } from "@/features/game-riddle/services/game-riddle";
import {
  formatGameType,
  getGameTypeConstants,
} from "@/features/game-riddle/utilities/game-type-helpers";
import { getGroupStats } from "@/features/game-riddle/utilities/get-group-stats";
import { getGamesByIds } from "@/features/game/services/game";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { groupBy } from "@/lib/utilities/groupBy";

/**
 * Gets user, gets allRiddles, gets user attempted Riddles. Filters in allRiddles. Group them by gameType
 * @param pgn - Full PGN string
 * @returns Space-separated UCI moves (e.g. "e2e4 e7e5") or null if invalid
 */
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

  const groupGameTypes = Object.keys(riddleGameTypeGroups);

  // ========================================================================
  // Fetch games for riddles (unique gameIds) - single query
  // new Set(...) eliminates same values. [... ] converts it to array
  // ========================================================================
  const gameIds = [...new Set(allRiddles.map((r) => r.gameId))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-12 pb-16">
      <div className="space-y-6">
        {groupGameTypes.map((gameType) => {
          const riddles = riddleGameTypeGroups[gameType] ?? [];
          const displayName = formatGameType(gameType);
          const gameTypeConstants = getGameTypeConstants(gameType);
          const stats = getGroupStats(riddles, attemptByRiddleId);

          return (
            <div key={gameType} className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-2 py-3">
                <CollectionHeader
                  title={displayName}
                  imageSrc={`/images/challanges/${gameType}_3.png`}
                  imageAlt={displayName}
                  description={gameTypeConstants.description}
                  quote={gameTypeConstants.quote}
                  author={gameTypeConstants.author}
                  itemCount={riddles.length}
                  itemLabel="riddles"
                />
                <ProgressStatsCard
                  percentage={stats.percentage}
                  className="shrink-0"
                />
              </div>
              <ChallengeDataList
                riddles={riddles}
                gameMap={gameMap}
                attemptByRiddleId={attemptByRiddleId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
