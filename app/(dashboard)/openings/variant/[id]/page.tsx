import OpeningsController from "@/features/openings/components/openings-controller";
import {
  getOpeningById,
  getOpeningVariantById,
  getOpeningVariantsByOpeningId,
} from "@/features/openings/services/openings";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function OpeningVariantPage({ params }: Params) {
  const { supabase } = await getAuthenticatedUser();
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
  const currentIndex = variants.findIndex((v) => v.id === variant.id);
  const nextVariant =
    currentIndex >= 0 && currentIndex < variants.length - 1
      ? variants[currentIndex + 1]
      : null;

  // ======================================================================
  // Get the opening
  // Get the return URL
  // ======================================================================
  const opening = await getOpeningById(supabase, variant.openingId);
  const parentOpeningUrl =
    opening?.slug && opening?.id
      ? `/openings/${opening.slug}/${opening.id}`
      : "/openings";

  return (
    <OpeningsController
      variant={variant}
      nextVariantId={nextVariant?.id ?? null}
      parentOpeningUrl={parentOpeningUrl}
    />
  );
}
