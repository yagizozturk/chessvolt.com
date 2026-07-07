import type { DrawShape } from "@lichess-org/chessground/draw";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHeaderWithImage } from "@/components/page-header";
import { ArrowsBoardCard } from "@/features/arrows/components/arrows-board-card/arrows-board-card";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { getOpeningById, getOpeningVariantsByOpeningId } from "@/features/openings/services/openings.service";
import { flattenOpeningArrowGroups } from "@/features/openings/types/opening";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import { computeSequenceAttemptAccuracy } from "@/features/user-sequence-attempt/utilities/compute-sequence-attempt-accuracy";
import { mapAttemptStatsBySequenceId as buildMapAttemptStatsBySequenceId } from "@/features/user-sequence-attempt/utilities/map-attempt-stats-by-sequence-id";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function OpeningBySlugAndIdPage({ params }: Params) {
  const { slug, id } = await params;
  const { user, supabase } = await getPublicUser();

  const opening = await getOpeningById(supabase, id);
  if (!opening) {
    notFound();
  }

  const variants = await getOpeningVariantsByOpeningId(supabase, opening.id);

  const sequenceIds = [...new Set(variants.map((v) => v.moveSequence.id))];
  const stats = user ? await attemptService.getLatestAttemptStatsForSequences(supabase, user.id, sequenceIds) : [];
  const mapAttemptStatsBySequenceId = buildMapAttemptStatsBySequenceId(stats);

  const total = variants.length;
  const correct = variants.filter(
    (variant) => attemptStatusToIsComplete(mapAttemptStatsBySequenceId[variant.moveSequence.id]?.status) === true,
  ).length;
  const solveRate = total > 0 ? Math.round((correct / total) * 100) : 0;
  const boardArrows = (opening.arrows ? flattenOpeningArrowGroups(opening.arrows) : []) as DrawShape[];

  return (
    <div className="page-container">
      <div className="page-container-list-layout">
        <div className="md:hidden">
          <PageHeaderWithImage
            title={opening.name}
            description={opening.description ?? ""}
            imageSrc="/images/openings/bg-london-opening-5.png"
            imageAlt={opening.name}
          />
        </div>
        <div className="hidden gap-4 rounded-lg bg-[#FDCB15] md:flex">
          <div className="min-w-0 flex-1 space-y-2 p-4">
            <ArrowsBoardCard
              openingId={opening.id}
              name={opening.name}
              description={opening.description ?? ""}
              arrows={boardArrows}
              size={160}
            />
          </div>
          <div className="overflow-hidden rounded-lg">
            <Image
              src="/images/openings/bg-london-opening-5.png"
              alt={opening.name}
              width={400}
              height={300}
              className="object-contain"
            />
          </div>
        </div>
        <div className="page-container-grid-data-layout">
          {variants.map((variant) => {
            const attemptStats = mapAttemptStatsBySequenceId[variant.moveSequence.id];

            return (
              <OpeningBoardCard
                key={variant.id}
                id={variant.id}
                name={variant.title ?? ""}
                boardWrapperClassName="aspect-square w-[180px] shrink-0"
                href={`/openings/variant/${variant.id}`}
                fen={variant.moveSequence.displayFen ?? variant.moveSequence.initialFen}
                isComplete={attemptStatusToIsComplete(attemptStats?.status)}
                accuracyPercent={attemptStats ? computeSequenceAttemptAccuracy(attemptStats) : null}
                description={variant.description}
                moves={variant.moveSequence.moves}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
