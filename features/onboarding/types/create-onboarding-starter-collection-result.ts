import type { Collection } from "@/features/collection/types/collection";

export type CreateOnboardingStarterCollectionResult =
  | { created: true; collections: Collection[] }
  | { created: false; reason: "declined" | "already_exists" | "failed" };
