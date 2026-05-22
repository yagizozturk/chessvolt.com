import { ChallengeDataList } from "@/features/challenge/components/challenge-data-list";
import { ChallengeHeader } from "@/features/challenge/components/challenge-header";
import { getActiveRiddles } from "@/features/riddle/services/riddle.service";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { buildAttemptByRiddleId } from "@/features/user-sequence-attempt/utilities/build-attempt-by-riddle-id";
import { formatGameType, getGameTypeConstants } from "@/features/riddle/utilities/game-type-helpers";
import { getGroupStats } from "@/features/riddle/utilities/get-group-stats";
import { getGamesByIds } from "@/features/game/services/game.service";
import { getPublicUser } from "@/lib/supabase/auth";
import { groupBy } from "@/lib/utils/groupBy";

/**
 * Fonksyon Bilgisi ✅
 * 1. Kullanıcı bilgileri alınır
 * 2. Tüm oyunlarıdaki tüm Riddle lar çekilir
 * 3. Oyuncunun move sequence attempt özetleri çekilir
 * 4. Riddle id → solved/wrong/undefined haritası oluşturulur
 * Gets user, gets allRiddles, gets user attempted Riddles. Filters in allRiddles. Group them by gameType
 * Full PGN string
 *
 */
export default async function ChallengePage() {
  // ========================================================================
  // (1,2,3) Getting riddles and attempts for games
  // ========================================================================
  const { user, supabase } = await getPublicUser();
  const allRiddles = await getActiveRiddles(supabase);

  const sequenceIds = [...new Set(allRiddles.map((r) => r.moveSequence.id))];
  const summaries = user
    ? await attemptService.getLatestSummariesForSequences(supabase, user.id, sequenceIds)
    : [];
  const attemptByRiddleId = buildAttemptByRiddleId(allRiddles, summaries);

  // ========================================================================
  // 5. Grouping data by gameType in riddles. (gameType is required; filter legacy nulls)
  // ========================================================================
  const riddlesWithGameType = allRiddles.filter((r) => r.gameType?.trim());
  const riddleGameTypeGroups = groupBy(riddlesWithGameType, (r) => r.gameType!.trim());

  const groupGameTypes = Object.keys(riddleGameTypeGroups);

  // ========================================================================
  // Fetch games for riddles (unique gameIds) - single query
  // new Set(...) eliminates same values. [... ] converts it to array
  // ========================================================================
  const gameIds = [...new Set(allRiddles.map((r) => r.gameId))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      <div className="space-y-6">
        {groupGameTypes.map((gameType) => {
          const riddles = riddleGameTypeGroups[gameType] ?? [];
          const displayName = formatGameType(gameType);
          const gameTypeConstants = getGameTypeConstants(gameType);
          const stats = getGroupStats(riddles, attemptByRiddleId);

          return (
            <div className="flex flex-col gap-4" key={gameType}>
              <ChallengeHeader
                title={displayName}
                imageSrc={`/images/challanges/bg-${gameType}.png`}
                imageAlt={displayName}
                description={gameTypeConstants.description}
                quote={gameTypeConstants.quote}
                author={gameTypeConstants.author}
                itemCount={riddles.length}
                itemLabel="riddles"
              />
              <ChallengeDataList riddles={riddles} gameMap={gameMap} attemptByRiddleId={attemptByRiddleId} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
