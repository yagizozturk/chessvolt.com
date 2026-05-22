import type { DrawShape } from "@lichess-org/chessground/draw";
import { PartyPopper } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArrowsBoardCard } from "@/features/arrows/components/arrows-board-card/arrows-board-card";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import OpeningMainSidebar from "@/features/openings/components/opening-main-sidebar/opening-main-sidebar";
import {
  getCorrectlySolvedVariantIds,
  getOpeningById,
  getOpeningVariantAttemptsForVariants,
  getOpeningVariantsByOpeningId,
} from "@/features/openings/services/openings.service";
import { flattenOpeningArrowGroups } from "@/features/openings/types/opening";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string; id: string }>;
};

/**
 * Fonksyon Bilgisi ✅
 * 1. İlgili opening id ye göre çekilir
 * 2. İlgili opening'ın tüm variantları çekilir
 * 3. Oyunucunun bu variantlarda daha önce deneyip denemediği, doğru yanlış bilgisi çekilir
 * 4. İstatistikler çekilen verilere göre hesaplanır
 */
export default async function OpeningBySlugAndIdPage({ params }: Params) {
  const { slug, id } = await params;
  const { user, supabase } = await getPublicUser();

  // ========================================================================
  // 1. İlgili opening id ye göre çekilir
  // ========================================================================
  const opening = await getOpeningById(supabase, id);
  if (!opening) {
    notFound();
  }

  // ========================================================================
  // 2. İlgili opening'ın tüm variantları çekilir
  // ========================================================================
  const variants = await getOpeningVariantsByOpeningId(supabase, opening.id);
  const variantIds = variants.map((v) => v.id);

  // ========================================================================
  // 3. Auth user için doğru/yanlış bilgisi (sadece giriş yapmışsa)
  // Eğer giriş yapmamışsa solvedVariantIds ve attempts boş array/set olacak.
  // ========================================================================
  const [solvedVariantIds, attempts] = user
    ? await Promise.all([
        getCorrectlySolvedVariantIds(supabase, user.id, variantIds),
        getOpeningVariantAttemptsForVariants(supabase, user.id, variantIds),
      ])
    : [new Set<string>(), []];

  // ========================================================================
  // 4. İstatistikler
  // ========================================================================
  const total = variants.length;
  const correct = attempts.filter((a) => a.isCorrect).length;
  const solveRate = total > 0 ? Math.round((correct / total) * 100) : 0;
  const boardArrows = (opening.arrows ? flattenOpeningArrowGroups(opening.arrows) : []) as DrawShape[];

  return (
    <div className="container mx-auto max-w-6xl pt-10 pb-16">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 rounded-lg bg-[#FDCB15]">
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
        <div className="grid grid-cols-2 gap-6">
          {variants.map((variant) => {
            return (
              <OpeningBoardCard
                key={variant.id}
                id={variant.id}
                name={variant.title ?? ""}
                group={variant.group}
                size={240}
                href={`/openings/variant/${variant.id}`}
                fen={variant.moveSequence.displayFen ?? variant.moveSequence.initialFen}
                isComplete={solvedVariantIds.has(variant.id) ? true : undefined}
                description={variant.description}
              />
            );
          })}
          {/* <div className="space-y-4">
          <OpeningMainSidebar title={opening.name} subPlayCount={total} />
          <ProgressStatsCard percentage={solveRate} label="Solved Variants" icon={PartyPopper} className="w-full" />
        </div> */}
        </div>
      </div>
    </div>
  );
}
