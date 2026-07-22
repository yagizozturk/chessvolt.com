"use client";

import { useRouter } from "next/navigation";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FAVORITES_VIEW_OPTIONS, type FavoritesView } from "@/features/favorites/types/favorites-view";

type FavoritesViewFilterProps = {
  view: FavoritesView;
};

export function FavoritesViewFilter({ view }: FavoritesViewFilterProps) {
  const router = useRouter();

  return (
    <div className="min-w-0 sm:max-w-56">
      <Select
        value={view}
        onValueChange={(value) => {
          const option = FAVORITES_VIEW_OPTIONS.find((item) => item.value === value);
          if (option) router.push(option.href);
        }}
      >
        <SelectTrigger
          id="favorites-view"
          className="w-full rounded-xl border-2 bg-background"
          aria-label="Filter favorites by source"
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
