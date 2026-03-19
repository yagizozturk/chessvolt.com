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

export default async function OpeningVariantPage({ params }: Params) {
  const { user, supabase } = await getPublicUser();
  const { id } = await params;
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
  const solvedVariantIds = user
    ? await getCorrectlySolvedVariantIds(supabase, user.id, variantIds)
    : new Set<string>();
  const currentIndex = variants.findIndex((v) => v.id === variant.id);
  const nextVariant =
    currentIndex >= 0 && currentIndex < variants.length - 1
      ? variants[currentIndex + 1]
      : null;

  // ======================================================================
  // Get the opening
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
