import { notFound } from "next/navigation";

import { buildVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getSequenceMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { CollectionHeader } from "@/features/collection/components/collection-header";
import { getCollectionBySlug } from "@/features/collection/services/collection.service";
import { getGamesByIds } from "@/features/game/services/game.service";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import {
  isRiddleRatingBand,
  matchesRiddleRatingBand,
  type RiddleRatingBand,
} from "@/features/riddle/types/riddle-rating";
import { getRiddlesByCollectionId } from "@/features/riddle/services/riddle.service";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { buildAttemptByRiddleId } from "@/features/user-sequence-attempt/utilities/build-attempt-by-riddle-id";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ratingBand?: string }>;
};

export default async function CollectionDetailPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { ratingBand: selectedRatingBand = "all" } = await searchParams;
  const { user, supabase } = await getPublicUser();

  const collection = await getCollectionBySlug(supabase, slug);
  if (!collection || !collection.isActive) {
    notFound();
  }

  const allRiddles = await getRiddlesByCollectionId(supabase, collection.id, { activeOnly: true });
  const trimmedRatingBand = selectedRatingBand.trim();
  const ratingBand: RiddleRatingBand = isRiddleRatingBand(trimmedRatingBand) ? trimmedRatingBand : "all";
  const riddles =
    ratingBand === "all"
      ? allRiddles
      : allRiddles.filter((riddle) => matchesRiddleRatingBand(riddle.rating, ratingBand));

  const sequenceIds = [...new Set(riddles.map((r) => r.moveSequence.id))];
  const summaries = user ? await attemptService.getLatestSummariesForSequences(supabase, user.id, sequenceIds) : [];
  const attemptByRiddleId = buildAttemptByRiddleId(riddles, summaries);

  const isOwnerCustomCollection =
    Boolean(user) && collection.collectionType === "custom" && collection.createdBy === user?.id;

  const voltBySequenceId =
    isOwnerCustomCollection && riddles.length > 0
      ? buildVoltScoresBySequenceId(
          await attemptService.getAttemptsByUserAndSequenceIds(supabase, user!.id, sequenceIds),
          riddles.map((riddle) => ({
            sequenceId: riddle.moveSequence.id,
            totalMoveCount: getSequenceMoveCount(riddle.moveSequence.moves),
            rating: getRiddleRatingForScoring(riddle.rating),
          })),
        )
      : {};

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
            .map((riddle, index) => {
              const game = riddle.gameId ? gameMap[riddle.gameId] : null;
              if (!game && !riddle.moveSequence.displayFen) return null;
              return { riddle, game, index };
            })
            .filter((x): x is NonNullable<typeof x> => x != null)
            .map(({ riddle, game, index }) => {
              const num = index + 1;

              return (
                <RiddleBoardCard
                  key={riddle.id}
                  riddle={riddle}
                  game={game}
                  num={num}
                  size={240}
                  isComplete={attemptByRiddleId[riddle.id]?.isComplete}
                  accuracyPercent={attemptByRiddleId[riddle.id]?.accuracyPercent}
                  displayFen={riddle.moveSequence.displayFen}
                  voltScore={voltBySequenceId[riddle.moveSequence.id] ?? null}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
