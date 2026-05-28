import { ChallengeDataList } from "@/features/challenge/components/challenge-data-list";
import { ChallengeFilters } from "@/features/challenge/components/challenge-filters";
import { ChallengeHeader } from "@/features/challenge/components/challenge-header";
import { getGamesByIds } from "@/features/game/services/game.service";
import { getActiveRiddles } from "@/features/riddle/services/riddle.service";
import { formatGameType, getGameTypeConstants } from "@/features/riddle/utilities/game-type-helpers";
import { getGroupStats } from "@/features/riddle/utilities/get-group-stats";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { buildAttemptByRiddleId } from "@/features/user-sequence-attempt/utilities/build-attempt-by-riddle-id";
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
type ChallengePageProps = {
  searchParams: Promise<{
    level?: string;
    gameType?: string;
  }>;
};

export default async function ChallengePage({ searchParams }: ChallengePageProps) {
  const params = await searchParams;
  const selectedLevel = params.level?.trim() || "all";
  const selectedGameType = params.gameType?.trim() || "all";

  // ========================================================================
  // (1,2,3) Getting riddles and attempts for games
  // ========================================================================
  const { user, supabase } = await getPublicUser();
  const allRiddles = await getActiveRiddles(supabase);

  const filteredRiddles = allRiddles.filter((riddle) => {
    const matchesGameType = selectedGameType === "all" || riddle.gameType?.trim() === selectedGameType;
    return matchesGameType;
  });

  const sequenceIds = [...new Set(filteredRiddles.map((r) => r.moveSequence.id))];
  const summaries = user ? await attemptService.getLatestSummariesForSequences(supabase, user.id, sequenceIds) : [];
  const attemptByRiddleId = buildAttemptByRiddleId(filteredRiddles, summaries);

  // ========================================================================
  // 5. Grouping data by gameType in riddles. (gameType is required; filter legacy nulls)
  // ========================================================================
  const riddlesWithGameType = filteredRiddles.filter((r) => r.gameType?.trim());
  const riddleGameTypeGroups = groupBy(riddlesWithGameType, (r) => r.gameType!.trim());

  const groupGameTypes = Object.keys(riddleGameTypeGroups);
  const allGameTypeOptions = Array.from(
    new Set(allRiddles.map((r) => r.gameType?.trim()).filter((gameType): gameType is string => Boolean(gameType))),
  ).sort((a, b) => a.localeCompare(b));

  // ========================================================================
  // Fetch games for riddles (unique gameIds) - single query
  // new Set(...) eliminates same values. [... ] converts it to array
  // ========================================================================
  const gameIds = [...new Set(filteredRiddles.map((r) => r.gameId).filter((id): id is string => id != null))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      <div className="space-y-10">
        <ChallengeFilters
          gameTypeOptions={allGameTypeOptions}
          selectedLevel={selectedLevel}
          selectedGameType={selectedGameType}
        />
      </div>
      <div className="mt-12 space-y-24">
        {groupGameTypes.length === 0 && (
          <div className="bg-muted/40 rounded-xl px-4 py-8 text-center">
            <p className="text-muted-foreground">No challenges found for the selected filters.</p>
          </div>
        )}
        {groupGameTypes.map((gameType) => {
          const riddles = riddleGameTypeGroups[gameType] ?? [];
          const displayName = formatGameType(gameType);
          const gameTypeConstants = getGameTypeConstants(gameType);
          const stats = getGroupStats(riddles, attemptByRiddleId);

          return (
            <div className="flex flex-col gap-4" key={gameType}>
              <ChallengeHeader
                title={displayName}
                imageSrc={`/images/challanges/${gameType}.png`}
                imageAlt={displayName}
                description={gameTypeConstants.description}
                quote={gameTypeConstants.quote}
                author={gameTypeConstants.author}
                backgroundColor={gameTypeConstants.backgroundColor}
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
