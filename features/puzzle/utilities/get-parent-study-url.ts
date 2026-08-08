import type { Study } from "@/features/study/types/study";

export function getParentStudyUrl(study: Study): string {
  return `/study/${study.slug}`;
}
