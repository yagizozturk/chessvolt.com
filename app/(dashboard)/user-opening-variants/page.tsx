import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeaderWithImage } from "@/components/page-header";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { getUserPracticeOpeningVariantsForUserWithSequences } from "@/features/user-practice-opening-variant/services/user-practice-opening-variant.service";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function UserOpeningVariantsPage() {
  const { user, supabase } = await getAuthenticatedUser();

  const userPracticeOpeningVariants = await getUserPracticeOpeningVariantsForUserWithSequences(supabase, user.id);

  const openingVariantSequenceIds = [
    ...new Set(userPracticeOpeningVariants.map((practice) => practice.openingVariant.moveSequence.id)),
  ];

  const openingAttempts =
    openingVariantSequenceIds.length > 0
      ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, user.id, openingVariantSequenceIds)
      : [];

  const voltScoresBySequenceId =
    openingVariantSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          openingAttempts,
          userPracticeOpeningVariants.map((openingVariant) => ({
            sequenceId: openingVariant.openingVariant.moveSequence.id,
            totalMoveCount: getPlayerMoveCount(openingVariant.openingVariant.moveSequence.moves),
            rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
          })),
        )
      : {};

  return (
    <div className="page-container">
      <div className="page-container-list-layout">
        <PageHeaderWithImage
          title="Your Opening List"
          description="Build your repertoire, one variant at a time"
          imageSrc="/images/openings/bg-openings.png"
          imageAlt="Opening"
        />

        {userPracticeOpeningVariants.length === 0 ? (
          <EmptyDataMessage message="You haven't added any opening variants to your practice list yet." />
        ) : (
          <div className="page-container-grid-data-layout">
            {userPracticeOpeningVariants.map((practice) => {
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
        )}
      </div>
    </div>
  );
}
