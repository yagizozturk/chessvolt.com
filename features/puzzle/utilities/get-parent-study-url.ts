import type { Study } from "@/features/study/types/study";

export function getParentStudyUrl(study: Study): string {
  return `/studies/${study.slug}`;
}
