import type { SupabaseClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { calculateVoltScore } from "@/components/calculator/volt-calculator/build-volt-score";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import OpeningVariantController from "@/features/openings/components/opening-variant-controller";
import { getOpeningBySlug, getOpeningVariantsByOpeningId } from "@/features/openings/services/openings.service";
import {
  getOpeningPath,
  getOpeningVariantPath,
  getOpeningVariantSlug,
} from "@/features/openings/utilities/opening-variant-path.utils";
import { getUserFavoriteByUserAndOpeningVariant } from "@/features/user-favorites/services/user-favorite.service";
import { getAttemptsByUserAndSequence } from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { variantDocumentDescription, variantDocumentTitle } from "@/lib/metadata/training-page-metadata";
import { getPublicUser } from "@/lib/supabase/auth";

type OpeningVariantPageProps = {
  params: Promise<{ slug: string; variantSlug: string }>;
};

// ======================================================================
// Açılış slug ile, varyant ise açılışın varyantları arasında başlık slug'ı ile bulunur.
// ======================================================================
async function findOpeningVariant(supabase: SupabaseClient, slug: string, variantSlug: string) {
  const opening = await getOpeningBySlug(supabase, slug);
  if (!opening) {
    notFound();
  }

  const variants = await getOpeningVariantsByOpeningId(supabase, opening.id);
  const variant = variants.find((v) => getOpeningVariantSlug(v) === variantSlug);
  if (!variant) {
    notFound();
  }

  return { opening, variants, variant };
}

export async function generateMetadata({ params }: OpeningVariantPageProps): Promise<Metadata> {
  const { slug, variantSlug } = await params;
  const { supabase } = await getPublicUser();
  const { opening, variant } = await findOpeningVariant(supabase, slug, variantSlug);

  return {
    title: variantDocumentTitle(variant.title, opening.name),
    description: variantDocumentDescription(variant.title, variant.description),
  };
}

export default async function OpeningVariantPage({ params }: OpeningVariantPageProps) {
  const { slug, variantSlug } = await params;
  const { user, supabase } = await getPublicUser();
  const { opening, variants, variant } = await findOpeningVariant(supabase, slug, variantSlug);

  // ======================================================================
  // Kullanıcının favori açılışı olup olmadığını kontrol ederiz.
  // ======================================================================
  const favoriteRow = user ? await getUserFavoriteByUserAndOpeningVariant(supabase, user.id, variant.id) : null;

  // ======================================================================
  // CurrentIndex den sonraki varyantı çekeriz. Next buttonuna basınca çalışır.
  // ======================================================================
  const currentIndex = variants.findIndex((v) => v.id === variant.id);
  const nextVariant = currentIndex >= 0 ? variants[currentIndex + 1] : undefined;
  const nextVariantPath = nextVariant ? getOpeningVariantPath(opening, nextVariant) : null;

  // ======================================================================
  // Ana URL geri buttonu için
  // ======================================================================
  const parentOpeningUrl = getOpeningPath(opening);

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
      nextVariantPath={nextVariantPath}
      parentOpeningUrl={parentOpeningUrl}
      canFavorite={Boolean(user)}
      isFavorited={isFavorited}
      voltScore={voltScore}
    />
  );
}
