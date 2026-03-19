import OpeningsController from "@/features/openings/components/openings-controller";
import {
  getCorrectlySolvedVariantIds,
  getOpeningById,
  getOpeningVariantById,
  getOpeningVariantsByOpeningId,
} from "@/features/openings/services/openings";
import { getPublicUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";

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
 * 6.
 *
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
  const variants = await getOpeningVariantsByOpeningId(
    supabase,
    variant.openingId,
  );
  const variantIds = variants.map((v) => v.id);

  // ======================================================================
  // 3. Get the next variant
  // ======================================================================
  const currentIndex = variants.findIndex((v) => v.id === variant.id);
  const nextVariant =
    currentIndex >= 0 && currentIndex < variants.length - 1
      ? variants[currentIndex + 1]
      : null;

  // ======================================================================
  // 4. Get the solved variant ids for the user
  // Eğer giriş yapmamışsa solvedVariantIds boş set olacak.
  // ======================================================================
  const solvedVariantIds = user
    ? await getCorrectlySolvedVariantIds(supabase, user.id, variantIds)
    : new Set<string>();

  // ======================================================================
  // 5. Get the opening
  // Get the return URL and progress stats
  // ======================================================================
  const opening = await getOpeningById(supabase, variant.openingId);
  const parentOpeningUrl =
    opening?.slug && opening?.id
      ? `/openings/${opening.slug}/${opening.id}`
      : "/openings";

  const progressPercentage =
    variants.length > 0
      ? Math.round((solvedVariantIds.size / variants.length) * 100)
      : 0;

  return (
    <OpeningsController
      variant={variant}
      openingName={opening?.name ?? "Opening"}
      nextVariantId={nextVariant?.id ?? null}
      parentOpeningUrl={parentOpeningUrl}
      progressPercentage={progressPercentage}
    />
  );
}
