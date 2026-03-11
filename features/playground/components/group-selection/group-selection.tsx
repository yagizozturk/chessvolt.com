"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import GroupSelectionItem from "./group-selection-item";

type GroupSelectionProps = {
  items?: Array<{
    id: string;
    icon: LucideIcon;
    value: string | number;
    text: string;
  }>;
  onSelectionChange?: (selectedId: string | null) => void;
};

export default function GroupSelection({
  items = [],
  onSelectionChange,
}: GroupSelectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    items.length > 0 ? items[0].id : null
  );

  useEffect(() => {
    if (items.length > 0 && selectedId === items[0].id) {
      onSelectionChange?.(items[0].id);
    }
  }, []);

  const handleItemClick = (id: string) => {
    const newSelectedId = selectedId === id ? null : id;
    setSelectedId(newSelectedId);
    onSelectionChange?.(newSelectedId);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <GroupSelectionItem
          key={item.id}
          icon={item.icon}
          value={item.value}
          text={item.text}
          isSelected={selectedId === item.id}
          onClick={() => handleItemClick(item.id)}
        />
      ))}
    </div>
  );
}