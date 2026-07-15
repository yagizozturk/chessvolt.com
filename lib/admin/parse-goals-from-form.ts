// TODO: Refactor
import { redirect } from "next/navigation";

import type { MoveGoals } from "@/features/move-sequence/types/move-goal";
import { isMoveGoals } from "@/features/move-sequence/validation/move-sequence-goals";

export function parseGoalsFromForm(formData: FormData, errorRedirect: string): MoveGoals | null {
  const raw = formData.get("goals");
  if (raw === null) return null;
  const str = typeof raw === "string" ? raw.trim() : "";
  if (str === "") return null;
  try {
    const parsed = JSON.parse(str) as unknown;
    if (parsed === null) return null;
    if (!isMoveGoals(parsed)) redirect(errorRedirect);
    return parsed;
  } catch {
    redirect(errorRedirect);
  }
}
