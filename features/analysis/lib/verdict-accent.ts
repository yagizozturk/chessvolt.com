import type { MoveVerdictKind } from "@/lib/engine/move-verdict";

export function verdictAccent(kind: MoveVerdictKind): string {
  switch (kind) {
    case "best":
    case "excellent":
      return "text-emerald-600 dark:text-emerald-400";
    case "good":
      return "text-green-700 dark:text-green-400";
    case "inaccuracy":
      return "text-amber-600 dark:text-amber-400";
    case "mistake":
      return "text-orange-600 dark:text-orange-400";
    case "blunder":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-foreground";
  }
}
