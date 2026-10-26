import { notFound, permanentRedirect } from "next/navigation";

import { getOpeningById, getOpeningVariantById } from "@/features/openings/services/openings.service";
import { getOpeningVariantPath } from "@/features/openings/utilities/opening-variant-path.utils";
import { getPublicUser } from "@/lib/supabase/auth";

// Legacy /openings/variant/[id] URLs: the single segment here is the variant id.
export default async function LegacyOpeningVariantRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: id } = await params;
  const { supabase } = await getPublicUser();
  const variant = await getOpeningVariantById(supabase, id);
  const opening = variant ? await getOpeningById(supabase, variant.openingId) : null;

  if (!variant || !opening) {
    notFound();
  }

  permanentRedirect(getOpeningVariantPath(opening, variant));
}
