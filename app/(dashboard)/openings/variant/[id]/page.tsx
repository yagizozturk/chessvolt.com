import { notFound } from "next/navigation";

import { calculateVoltScore } from "@/components/calculator/volt-calculator/build-volt-score";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import OpeningVariantController from "@/features/openings/components/opening-variant-controller";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import {
  getOpeningById,
  getOpeningVariantById,
  getOpeningVariantsByOpeningId,
} from "@/features/openings/services/openings.service";
import { getUserFavoriteByUserAndOpeningVariant } from "@/features/user-favorites/services/user-favorite.service";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

/**
 * Fonksyon Bilgisi ✅
 * 1. Public kullanıcı yetkisi ile variant detayı çekilir.
 * 2. Opening için tüm varyant bilgisi çekilir. bir sonraki varyanta geçebilmek için.
 * 3. Index leme ile sonraki varyant bulunur
 * 4. Oyuncu auth ise çözdüğü variantId lerine bakılır. Yoksa boş döner
 * 5. Opening bilgisi çekilip, slug bilgisi alınıp, returnUrl hesaplanır. Next variant yoksa ana opening e gider.
 * TODO: Opening i tekrar çekmeden buraya bilgi geçilebilirm?
 * 6. Progress percantege hesaplanır ve contoller a geçilir
 */
export default async function OpeningVariantPage({ params }: Params) {
  const { id } = await params;
  const { user, supabase } = await getPublicUser();
  const variant = await getOpeningVariantById(supabase, id);

  if (!variant) {
    notFound();
  }

  // ======================================================================
  // Get all the variants for the opening
  // Get the next variant if it exists
  // ======================================================================
  const variants = await getOpeningVariantsByOpeningId(supabase, variant.openingId);

  // ======================================================================
  // 3. Get the next variant
  // ======================================================================
  const currentIndex = variants.findIndex((v) => v.id === variant.id);
  const nextVariant = currentIndex >= 0 && currentIndex < variants.length - 1 ? variants[currentIndex + 1] : null;

  // ======================================================================
  // 5. Get the opening
  // Get the return URL and progress stats
  // ======================================================================
  const opening = await getOpeningById(supabase, variant.openingId);
  const parentOpeningUrl = opening?.slug && opening?.id ? `/openings/${opening.slug}/${opening.id}` : "/openings";

  const favouriteRow = user
    ? await getUserFavoriteByUserAndOpeningVariant(supabase, user.id, variant.id)
    : null;
  const isFavourited = Boolean(favouriteRow);

  const voltScore =
    user && isFavourited
      ? calculateVoltScore({
          attempts: await attemptService.getAttemptsByUserAndSequence(
            supabase,
            user.id,
            variant.moveSequence.id,
          ),
          totalMoveCount: getPlayerMoveCount(variant.moveSequence.moves),
          rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
        })
      : null;

  return (
    <>
      <OpeningVariantController
        variant={variant}
        nextVariantId={nextVariant?.id ?? null}
        parentOpeningUrl={parentOpeningUrl}
        canFavourite={Boolean(user)}
        isFavourited={isFavourited}
        voltScore={voltScore}
      />
    </>
  );
}
