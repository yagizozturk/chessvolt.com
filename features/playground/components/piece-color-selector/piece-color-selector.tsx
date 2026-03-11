"use client";

import { Sun, Moon } from "lucide-react";
import { useGameStore } from "@/features/game/store/game-store";
import GroupSelection from "../group-selection/group-selection";

const COLOR_ITEMS = [
  { color: "white" as const, icon: Sun, text: "White" },
  { color: "black" as const, icon: Moon, text: "Black" },
];

export default function PieceColorSelector() {
  const items = COLOR_ITEMS.map((item, index) => ({
    id: index.toString(),
    icon: item.icon,
    value: item.color,
    text: item.text,
  }));

  const handleSelectionChange = (selectedId: string | null) => {
    if (selectedId !== null) {
      const selectedItem = items.find((item) => item.id === selectedId);
      if (selectedItem) {
        useGameStore.setState({
          playerColor: selectedItem.value as "white" | "black",
        });
      }
    }
  };

  return (
    <GroupSelection items={items} onSelectionChange={handleSelectionChange} />
  );
}
