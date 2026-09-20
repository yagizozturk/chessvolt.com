"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DEFAULT_FAVORITES_SORT,
  FAVORITES_SORT_OPTIONS,
  type FavoritesSort,
} from "@/features/favorites/types/favorites-sort";

type FavoritesSortFilterProps = {
  sort: FavoritesSort;
};

export function FavoritesSortFilter({ sort }: FavoritesSortFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSort(value: FavoritesSort) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter");

    if (value === DEFAULT_FAVORITES_SORT) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const queryString = params.toString();
    router.push(queryString ? `/volt-tracker?${queryString}` : "/volt-tracker");
  }

  return (
    <div className="min-w-0 sm:max-w-56">
      <Select
        value={sort}
        onValueChange={(value) => {
          const option = FAVORITES_SORT_OPTIONS.find((item) => item.value === value);
          if (option) updateSort(option.value);
        }}
      >
        <SelectTrigger
          id="favorites-sort"
          className="w-full rounded-xl border-2 bg-background"
          aria-label="Sort Volt Tracker favorites"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {FAVORITES_SORT_OPTIONS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
