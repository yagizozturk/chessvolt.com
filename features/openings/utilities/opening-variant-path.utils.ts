import type { Opening } from "@/features/openings/types/opening";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { slugify } from "@/lib/utils/slugify";

export function getOpeningPath(opening: Pick<Opening, "id" | "slug" | "name">): string {
  return `/openings/${opening.slug ?? slugify(opening.name)}/${opening.id}`;
}

export function getOpeningVariantPath(
  opening: Pick<Opening, "id" | "slug" | "name">,
  variant: Pick<OpeningVariant, "id" | "title">,
): string {
  const variantSlug = variant.title ? slugify(variant.title) : "variant";
  return `${getOpeningPath(opening)}/${variantSlug}/${variant.id}`;
}
