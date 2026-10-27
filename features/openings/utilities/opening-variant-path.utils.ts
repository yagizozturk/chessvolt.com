import type { Opening } from "@/features/openings/types/opening";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { slugify } from "@/lib/utils/slugify";

function getOpeningSlug(opening: Pick<Opening, "slug" | "name">): string {
  return opening.slug ?? slugify(opening.name);
}

export function getOpeningVariantSlug(variant: Pick<OpeningVariant, "title">): string {
  return variant.title ? slugify(variant.title) : "variant";
}

export function getOpeningPath(opening: Pick<Opening, "slug" | "name">): string {
  return `/openings/${getOpeningSlug(opening)}`;
}

export function getOpeningVariantPath(
  opening: Pick<Opening, "slug" | "name">,
  variant: Pick<OpeningVariant, "title">,
): string {
  return `${getOpeningPath(opening)}/${getOpeningVariantSlug(variant)}`;
}
