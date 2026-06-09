import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import type { Game } from "@/features/game/types/game";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import type { Riddle } from "@/features/riddle/types/riddle";
import { buildCollectionRiddlePath } from "@/features/riddle/utilities/build-collection-riddle-path";
import { UserCollectionCard } from "@/features/user-practices/components/user-collection-card";
import type { SequenceAttemptStats } from "@/features/user-sequence-attempt/types/user-sequence-attempt";
import { toSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/to-sequence-attempt-stats";

type UserPracticeCollectionTabProps = {
  collection: CollectionWithRiddleCountAndThemes;
  riddles: Riddle[];
  gameMap: Record<string, Game>;
  riddleAttemptStatsBySequenceId: Record<string, SequenceAttemptStats>;
};

export function UserPracticeCollectionTab({
  collection,
  riddles,
  gameMap,
  riddleAttemptStatsBySequenceId,
}: UserPracticeCollectionTabProps) {
  const renderableRiddles = riddles
    .map((riddle) => {
      const game = riddle.gameId ? (gameMap[riddle.gameId] ?? null) : null;
      if (!game && !riddle.moveSequence.displayFen) return null;
      return { riddle, game };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);

  return (
    <section className="flex flex-col gap-4">
      <UserCollectionCard collection={collection} />
      {renderableRiddles.length === 0 ? (
        <p className="text-muted-foreground px-1 text-sm">No riddles in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {renderableRiddles.map(({ riddle, game }) => {
            const attemptDisplay = toSequenceAttemptStats(riddleAttemptStatsBySequenceId[riddle.moveSequence.id]);

            return (
              <RiddleBoardCard
                key={riddle.id}
                riddle={riddle}
                game={game}
                href={buildCollectionRiddlePath(collection.slug, riddle.id)}
                displayFen={riddle.moveSequence.displayFen}
                isComplete={attemptDisplay.isComplete}
                accuracyPercent={attemptDisplay.accuracyPercent}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
