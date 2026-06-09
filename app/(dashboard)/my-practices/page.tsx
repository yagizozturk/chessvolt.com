import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { buildVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getSequenceMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { getUserCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getGamesByIds } from "@/features/game/services/game.service";
import { getRiddlesByCollectionIds } from "@/features/riddle/services/riddle.service";
import { groupRiddlesByCollectionId } from "@/features/riddle/utilities/group-riddles-by-collection-id";
import { getUserPracticeOpeningVariantsForUserWithSequences } from "@/features/user-practice-opening-variant/services/user-practice-opening-variant.service";
import { UserPracticesTabs } from "@/features/user-practices/components/user-practices-tabs";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { mapAttemptStatsBySequenceId } from "@/features/user-sequence-attempt/utilities/map-attempt-stats-by-sequence-id";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function UserPracticesPage() {
  const { user, supabase } = await getAuthenticatedUser();

  const [userCollections, userPracticeVariants] = await Promise.all([
    getUserCollectionsWithRiddleCountAndThemes(supabase, user.id),
    getUserPracticeOpeningVariantsForUserWithSequences(supabase, user.id),
  ]);

  // ================================================================================================
  // Getting collection ids with a map. List of user custom collections
  // Getting riddles in those collections
  // ================================================================================================
  const collectionIds = userCollections.map((collection) => collection.id);

  // Example data of collectionRiddles:
  // [
  //   { collectionId: "col-111", riddle: { id: "r1", ... } },
  //   { collectionId: "col-111", riddle: { id: "r2", ... } },
  //   { collectionId: "col-222", riddle: { id: "r3", ... } },
  // ]
  const collectionRiddles = await getRiddlesByCollectionIds(supabase, collectionIds);

  // Example data of riddlesByCollectionId: Mapping by Collection Id. Groping them.
  // {
  //   "col-111": [{ id: "r1", ... }, { id: "r2", ... }],
  //   "col-222": [{ id: "r3", ... }],
  // }
  const riddlesByCollectionId = groupRiddlesByCollectionId(collectionRiddles);

  // Example data of allRiddles:
  // [
  //   { id: "r1", gameId: "game-1", moveSequence: { id: "seq-aaa-111", ... }, ... },
  //   { id: "r2", gameId: null, moveSequence: { id: "seq-bbb-222", ... }, ... },
  //   { id: "r3", gameId: "game-2", moveSequence: { id: "seq-ccc-333", ... }, ... },
  // ]
  const allRiddles = collectionRiddles.map((row) => row.riddle);

  // Example data of riddleSequenceIds:
  // ["seq-aaa-111", "seq-bbb-222", "seq-ccc-333"]
  const riddleSequenceIds = [...new Set(allRiddles.map((riddle) => riddle.moveSequence.id))];

  // ================================================================================================
  // Getting practice sequence ids. Having sequence data. different from collection
  // because collection has sub riddles. Opening variants is equal to riddles and have to have sequence data.
  // ================================================================================================
  const practiceSequenceIds = [
    ...new Set(userPracticeVariants.map((practice) => practice.openingVariant.moveSequence.id)),
  ];

  const [riddleAttemptStats, openingAttempts] = await Promise.all([
    riddleSequenceIds.length > 0
      ? attemptService.getLatestAttemptStatsForSequences(supabase, user.id, riddleSequenceIds)
      : Promise.resolve([]),
    practiceSequenceIds.length > 0
      ? attemptService.getAttemptsByUserAndSequenceIds(supabase, user.id, practiceSequenceIds)
      : Promise.resolve([]),
  ]);

  const riddleAttemptStatsBySequenceId = mapAttemptStatsBySequenceId(riddleAttemptStats);

  // ================================================================================================
  // Getting games Info by ids. Just for to show if a riddle is based on a real game
  // ================================================================================================
  const gameIds = [...new Set(allRiddles.map((riddle) => riddle.gameId).filter((id): id is string => id != null))];
  const games = gameIds.length > 0 ? await getGamesByIds(supabase, gameIds) : [];
  const gameMap = Object.fromEntries(games.map((game) => [game.id, game]));

  const voltBySequenceId =
    practiceSequenceIds.length > 0
      ? buildVoltScoresBySequenceId(
          openingAttempts,
          userPracticeVariants.map((practice) => ({
            sequenceId: practice.openingVariant.moveSequence.id,
            totalMoveCount: getSequenceMoveCount(practice.openingVariant.moveSequence.moves),
            rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
          })),
        )
      : {};

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <UserPracticesTabs
        userCollections={userCollections}
        userPracticeVariants={userPracticeVariants}
        riddlesByCollectionId={riddlesByCollectionId}
        gameMap={gameMap}
        riddleAttemptStatsBySequenceId={riddleAttemptStatsBySequenceId}
        voltBySequenceId={voltBySequenceId}
      />
    </div>
  );
}
