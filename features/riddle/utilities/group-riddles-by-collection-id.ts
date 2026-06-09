import type { CollectionRiddle } from "@/features/riddle/types/collection-riddle";
import type { Riddle } from "@/features/riddle/types/riddle";

// ================================================================================================
// Grouping riddles by collection id
// ================================================================================================
export function groupRiddlesByCollectionId(rows: CollectionRiddle[]): Record<string, Riddle[]> {
  const grouped: Record<string, Riddle[]> = {};

  for (const row of rows) {
    const list = grouped[row.collectionId] ?? [];
    list.push(row.riddle);
    grouped[row.collectionId] = list;
  }

  return grouped;
}
