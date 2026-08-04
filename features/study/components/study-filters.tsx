// TODO: Refactor
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  STUDY_DIFFICULTY_OPTIONS,
  type StudyDifficultyOptions,
  type StudyFilterState,
} from "@/features/study/types/study-filter";
import { buildStudyFilterUrl } from "@/features/study/utilities/study-filter.utils";
import type { Theme } from "@/features/theme/types/theme";

type StudyFiltersProps = {
  themeOptions: Theme[];
  searchQuery: string;
  difficultyFilter: StudyDifficultyOptions;
  themeFilter: string;
  hasActiveFilters: boolean;
};

export function StudyFilters({
  themeOptions,
  searchQuery,
  difficultyFilter,
  themeFilter,
  hasActiveFilters,
}: StudyFiltersProps) {
  const router = useRouter();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const currentFilterState: StudyFilterState = {
    searchQuery,
    difficultyFilter,
    themeFilter,
  };

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (localSearchQuery.trim() === searchQuery.trim()) return;

    const timeoutId = window.setTimeout(() => {
      router.push(buildStudyFilterUrl(currentFilterState, { searchQuery: localSearchQuery }));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [localSearchQuery, searchQuery, difficultyFilter, themeFilter, router]);

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <div className="min-w-0 sm:max-w-56">
        <Select
          value={difficultyFilter}
          onValueChange={(value) =>
            router.push(buildStudyFilterUrl(currentFilterState, { difficultyFilter: value as StudyDifficultyOptions }))
          }
        >
          <SelectTrigger
            id="study-difficulty"
            className="w-full rounded-xl border-2 bg-background"
            aria-label="Filter by difficulty"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STUDY_DIFFICULTY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-0 sm:max-w-56">
        <Select
          value={themeFilter}
          onValueChange={(value) => router.push(buildStudyFilterUrl(currentFilterState, { themeFilter: value }))}
          disabled={themeOptions.length === 0}
        >
          <SelectTrigger
            id="study-theme"
            className="w-full rounded-xl border-2 bg-background"
            aria-label="Filter by theme"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All themes</SelectItem>
              {themeOptions.map((theme) => (
                <SelectItem key={theme.slug} value={theme.slug}>
                  {theme.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-0 sm:ml-auto sm:max-w-xs sm:flex-1">
        <Input
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          placeholder="Search studies..."
          aria-label="Search studies"
          className="bg-background"
        />
      </div>
      {hasActiveFilters && (
        <Button type="button" variant="volt" size="sm" onClick={() => router.push("/study")}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
