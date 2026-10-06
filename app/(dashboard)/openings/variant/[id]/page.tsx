import { notFound } from "next/navigation";

import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { calculateVoltScore } from "@/components/calculator/volt-calculator/build-volt-score";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import OpeningVariantController from "@/features/openings/components/opening-variant-controller";
import {
  getOpeningById,
  getOpeningVariantById,
  getOpeningVariantsByOpeningId,
} from "@/features/openings/services/openings.service";
import { getUserFavoriteByUserAndOpeningVariant } from "@/features/user-favorites/services/user-favorite.service";
import { getAttemptsByUserAndSequence } from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getPublicUser } from "@/lib/supabase/auth";

type OpeningVariantPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OpeningVariantPage({ params }: OpeningVariantPageProps) {
  const { id } = await params;
  const { user, supabase } = await getPublicUser();
  const variant = await getOpeningVariantById(supabase, id);

  if (!variant) {
    notFound();
  }

  // Paralel çalışabilecek metodlar
  const [variants, opening, favoriteRow] = await Promise.all([
    // ======================================================================
    // Açılışın tüm varyantlarını çekeriz.
    // ======================================================================
    getOpeningVariantsByOpeningId(supabase, variant.openingId),

    // ======================================================================
    // Id bazlı açılış bilgilerini çekeriz.
    // Ana URL geri buttonu için
    // ======================================================================
    getOpeningById(supabase, variant.openingId),

    // ======================================================================
    // Kullanıcının favori açılışı olup olmadığını kontrol ederiz.
    // ======================================================================
    user ? getUserFavoriteByUserAndOpeningVariant(supabase, user.id, variant.id) : Promise.resolve(null),
  ]);

  // ======================================================================
  // CurrentIndex den sonraki varyantı çekeriz. Next buttonuna basınca çalışır.
  // ======================================================================
  const currentIndex = variants.findIndex((v) => v.id === variant.id);
  const nextVariantId = currentIndex >= 0 ? (variants[currentIndex + 1]?.id ?? null) : null;

  // ======================================================================
  // Ana URL geri buttonu için
  // ======================================================================
  const parentOpeningUrl = opening?.slug && opening?.id ? `/openings/${opening.slug}/${opening.id}` : "/openings";

  const isFavorited = Boolean(favoriteRow);

  // ======================================================================
  // Volt puanını hesaplarız.
  // ======================================================================
  const voltScore =
    user && isFavorited
      ? calculateVoltScore({
          attempts: await getAttemptsByUserAndSequence(supabase, user.id, variant.moveSequence.id),
          totalMoveCount: getPlayerMoveCount(variant.moveSequence.moves),
          rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
        })
      : null;

  return (
    <OpeningVariantController
      variant={variant}
      nextVariantId={nextVariantId}
      parentOpeningUrl={parentOpeningUrl}
      canFavorite={Boolean(user)}
      isFavorited={isFavorited}
      voltScore={voltScore}
    />
  );
}
