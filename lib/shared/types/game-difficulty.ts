export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export const SKILL_LEVEL_MAP: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 5,
  Advanced: 10,
  Expert: 20,
};

// Array of all difficulty levels (for use in difficulty-selector)
export const DIFFICULTIES: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];
