import { notFound } from "next/navigation";

import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getSequenceMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { CollectionHeader } from "@/features/collection/components/collection-header";
import { getCollectionBySlugAndType } from "@/features/collection/services/collection.service";
import { getGamesByIds } from "@/features/game/services/game.service";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { getActiveRiddlesByCollectionId } from "@/features/riddle/services/riddle.service";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import { buildRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { mapAttemptStatsBySequenceId as buildMapAttemptStatsBySequenceId } from "@/features/user-sequence-attempt/utilities/map-attempt-stats-by-sequence-id";
import { toSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/to-sequence-attempt-stats";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionDetailPage({ params }: Params) {
  const { slug } = await params;
  const { user, supabase } = await getPublicUser();

  // ================================================================================================
  // Getting collection informatin by its slug(params)
  // ================================================================================================
  const collection = await getCollectionBySlugAndType(supabase, slug, "admin");
  if (!collection || !collection.isActive) {
    notFound();
  }

  // ================================================================================================
  // Getting all riddles in this collection by id
  // ================================================================================================
  const riddles = await getActiveRiddlesByCollectionId(supabase, collection.id);

  // ================================================================================================
  // Getting move sequence ids for riddles. Move sequence table holds e1e2 like moves
  // ================================================================================================
  const riddleSequenceIds = [...new Set(riddles.map((r) => r.moveSequence.id))];

  // ================================================================================================
  // Getting latest attempt stats by user for a single riddle for multiple SequenceIds
  // ================================================================================================
  const stats =
    user && riddleSequenceIds.length > 0
      ? await attemptService.getLatestAttemptStatsForSequences(supabase, user.id, riddleSequenceIds)
      : [];

  // ================================================================================================
  // Mapping attempt stats by sequence id
  // example data of mapAttemptStatsBySequenceId:
  //  "seq-aaa-111": {
  //   sequenceId: "seq-aaa-111",
  //   status: "completed",
  //   isCompleted: true,
  //   correctMoveCount: 8,
  //   wrongMoveCount: 1,
  //   hintCount: 0,
  //   maxCorrectStreak: 5,
  //   durationMs: 42000,
  // },
  // "seq-bbb-222": {
  //   sequenceId: "seq-bbb-222",
  //   status: "failed",
  //   isCompleted: false,
  //   correctMoveCount: 3,
  //   wrongMoveCount: 2,
  //   hintCount: 1,
  //   maxCorrectStreak: 2,
  //   durationMs: 18000,
  // },
  // ================================================================================================
  const mapAttemptStatsBySequenceId = buildMapAttemptStatsBySequenceId(stats);

  // ================================================================================================
  // Building volt scores by sequence id when user is logged in
  // ================================================================================================
  const riddleAttempts =
    user && riddleSequenceIds.length > 0
      ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, user.id, riddleSequenceIds)
      : [];

  const voltScoresBySequenceId =
    user && riddleSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          riddleAttempts,
          riddles.map((riddle) => ({
            sequenceId: riddle.moveSequence.id,
            totalMoveCount: getSequenceMoveCount(riddle.moveSequence.moves),
            rating: getRiddleRatingForScoring(riddle.rating),
          })),
        )
      : {};

  // ================================================================================================
  // The collection may have a riddle that is based on a real GAME.
  // Riddle table has a FK of gameId.
  // If there is a game. gameIds set is created. and used for selecting from DB and creating a map.
  // ================================================================================================
  const gameIds = [...new Set(riddles.map((r) => r.gameId).filter((id): id is string => id != null))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  return (
    <div className="container mx-auto max-w-6xl pt-10 pb-16">
      <div className="flex flex-col gap-4">
        <CollectionHeader collection={collection} />
        {riddles.length === 0 && (
          <div className="bg-muted/40 rounded-xl px-4 py-8 text-center">
            <p className="text-muted-foreground">No riddles found in this collection.</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {riddles
            .map((riddle) => {
              const game = riddle.gameId ? gameMap[riddle.gameId] : null;
              if (!game && !riddle.moveSequence.displayFen) return null;
              return { riddle, game };
            })
            .filter((x): x is NonNullable<typeof x> => x != null) // Skip unrenderable riddles: if there’s no game and no displayFen, return null.
            .map(({ riddle, game }) => {
              const attemptStats = toSequenceAttemptStats(mapAttemptStatsBySequenceId[riddle.moveSequence.id]);

              return (
                <RiddleBoardCard
                  key={riddle.id}
                  riddle={riddle}
                  game={game}
                  size={240}
                  href={buildRiddlePath(riddle.id, { collectionSlug: collection.slug, collectionType: "admin" })}
                  isComplete={attemptStats.isComplete}
                  accuracyPercent={attemptStats.accuracyPercent}
                  displayFen={riddle.moveSequence.displayFen} // Fen value and PGN value are stored in move sequence table
                  voltScore={voltScoresBySequenceId[riddle.moveSequence.id] ?? null}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
