"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DEFAULT_FAVORITES_VIEW,
  FAVORITES_VIEW_OPTIONS,
  type FavoritesView,
} from "@/features/favorites/types/favorites-view";

type FavoritesViewFilterProps = {
  view: FavoritesView;
};

export function FavoritesViewFilter({ view }: FavoritesViewFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateView(value: FavoritesView) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter");

    if (value === DEFAULT_FAVORITES_VIEW) {
      params.delete("view");
    } else {
      params.set("view", value);
    }

    const queryString = params.toString();
    router.push(queryString ? `/volt-tracker?${queryString}` : "/volt-tracker");
  }

  return (
    <div className="min-w-0 sm:max-w-56">
      <Select
        value={view}
        onValueChange={(value) => {
          const option = FAVORITES_VIEW_OPTIONS.find((item) => item.value === value);
          if (option) updateView(option.value);
        }}
      >
        <SelectTrigger
          id="favorites-view"
          className="w-full rounded-xl border-2 bg-background"
          aria-label="Filter Volt Tracker by source"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {FAVORITES_VIEW_OPTIONS.map(({ label, value }) => (
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
