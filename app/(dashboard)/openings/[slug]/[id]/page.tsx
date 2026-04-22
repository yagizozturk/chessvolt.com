import { CircleX, PartyPopper, Star } from "lucide-react";
import { notFound } from "next/navigation";

import { IconInformationCard } from "@/components/cards/icon-information-card";
import { ProgressStatsCard } from "@/components/cards/progress-stats-card";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import {
  getCorrectlySolvedVariantIds,
  getOpeningById,
  getOpeningVariantAttemptsForVariants,
  getOpeningVariantsByOpeningId,
} from "@/features/openings/services/openings.service";
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
  const attempted = attempts.length;
  const incorrect = attempted - correct;
  const solveRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        <div className="grid gap-6 px-2 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant, index) => {
            const num = index + 1;
            return (
              <OpeningBoardCard
                key={variant.id}
                id={variant.id}
                name={variant.title ?? ""}
                group={variant.group}
                num={num}
                width={250}
                height={250}
                href={`/openings/variant/${variant.id}`}
                fen={variant.displayFen ?? variant.initialFen}
                isComplete={solvedVariantIds.has(variant.id) ? true : undefined}
                description={variant.description}
              />
            );
          })}
        </div>
        <div className="space-y-4">
          <ProgressStatsCard percentage={solveRate} label="Solved variants" icon={PartyPopper} className="w-full" />
          <IconInformationCard value={correct} label="CORRECT" icon={Star} />
          <IconInformationCard value={incorrect} label="INCORRECT" icon={CircleX} />
        </div>
      </div>
    </div>
  );
}
