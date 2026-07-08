// TODO: Refactor
export type ResolveStarterCollectionEligibilityResult =
  | { ok: true }
  | { ok: false; reason: "declined" | "already_exists" };
