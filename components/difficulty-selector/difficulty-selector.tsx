"use client";

import { GraduationCap, Target, Zap, Crown } from "lucide-react";
import { useGameStore } from "@/stores/game-store";
import { DIFFICULTIES, SKILL_LEVEL_MAP } from "@/types/game";
import GroupSelection from "../group-selection/group-selection";

const DIFFICULTY_ICONS = {
  Beginner: GraduationCap,
  Intermediate: Target,
  Advanced: Zap,
  Expert: Crown,
} as const;

export default function DifficultySelector() {
  const items = DIFFICULTIES.map((difficulty, index) => ({
    id: index.toString(),
    icon: DIFFICULTY_ICONS[difficulty],
    value: SKILL_LEVEL_MAP[difficulty],
    text: difficulty,
  }));

  const handleSelectionChange = (selectedId: string | null) => {
    if (selectedId !== null) {
      const selectedItem = items.find((item) => item.id === selectedId);
      if (selectedItem) {
        useGameStore.setState({ difficulty: selectedItem.text });
      }
    }
  };

  return (
    <GroupSelection items={items} onSelectionChange={handleSelectionChange} />
  );
}
