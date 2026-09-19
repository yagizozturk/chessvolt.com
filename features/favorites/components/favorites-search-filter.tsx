"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

type FavoritesSearchFilterProps = {
  query: string;
};

export function FavoritesSearchFilter({ query }: FavoritesSearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const searchQuery = value.trim();
    params.delete("filter");

    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    router.replace(queryString ? `/volt-tracker?${queryString}` : "/volt-tracker", { scroll: false });
  }

  return (
    <div className="min-w-0 sm:min-w-42">
      <Input
        key={query}
        type="search"
        defaultValue={query}
        placeholder="Search"
        aria-label="Search Volt Tracker"
        onChange={(event) => updateSearch(event.currentTarget.value)}
      />
    </div>
  );
}
