import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import type { UserPracticeOpeningVariantWithDetails } from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

type UserPracticeOpeningVariantListProps = {
  openingVariants: UserPracticeOpeningVariantWithDetails[];
  voltScoresBySequenceId?: Record<string, VoltScoreResult>;
};

export function UserPracticeOpeningVariantList({
  openingVariants,
  voltScoresBySequenceId = {},
}: UserPracticeOpeningVariantListProps) {
  if (openingVariants.length === 0) {
    return <EmptyDataMessage message="You haven't added any opening variants to your practice list yet." />;
  }

  return (
    <div className="page-container-grid-data-layout">
      {openingVariants.map((practice) => {
        const { openingVariant } = practice;
        return (
          <OpeningBoardCard
            key={practice.id}
            id={openingVariant.id}
            name={openingVariant.title ?? "Untitled variant"}
            boardWrapperClassName="aspect-square w-[180px] shrink-0"
            href={`/openings/variant/${openingVariant.id}`}
            fen={openingVariant.moveSequence.displayFen ?? openingVariant.moveSequence.initialFen}
            description={openingVariant.description}
            moves={openingVariant.moveSequence.moves}
            voltScore={voltScoresBySequenceId[openingVariant.moveSequence.id] ?? null}
          />
        );
      })}
    </div>
  );
}
