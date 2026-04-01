/**
 * Groups array items by a key derived from each item. In docs.
 * @param items - Array to group
 * @param keyFn - Function that returns the group key for each item
 * @returns Record mapping each key to an array of items
 */
export function groupBy<T, K extends string>(
  items: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;

  for (const item of items) {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }

  return groups;
}
