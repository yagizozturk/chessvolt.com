"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ATTEMPTED_RIDDLES_SORT_OPTIONS,
  RIDDLES_THEME_FILTER_ALL,
  type AttemptedRiddlesSortBy,
} from "@/features/riddle/constants/riddles-list.constants";
import type { Theme } from "@/features/theme/types/theme";

type RiddlesFiltersProps = {
  themes: Theme[];
  themeValue: string;
  sortBy: AttemptedRiddlesSortBy;
  onThemeChange: (value: string) => void;
  onSortChange: (value: AttemptedRiddlesSortBy) => void;
  variant?: "default" | "inline";
};

export function RiddlesFilters({
  themes,
  themeValue,
  sortBy,
  onThemeChange,
  onSortChange,
  variant = "default",
}: RiddlesFiltersProps) {
  const isInline = variant === "inline";
  const triggerClassName = isInline ? "w-full rounded-xl border-2 bg-background" : "w-full rounded-xl border-2";

  return (
    <div
      className={
        isInline
          ? "flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-end"
          : "bg-muted/50 flex w-full flex-col gap-3 rounded-xl p-4 sm:flex-row sm:flex-wrap sm:items-center"
      }
    >
      <div className="min-w-0 sm:max-w-64">
        <Select value={themeValue} onValueChange={onThemeChange} disabled={themes.length === 0}>
          <SelectTrigger id="riddles-theme" className={triggerClassName} aria-label="Filter by theme">
            <SelectValue placeholder="All themes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={RIDDLES_THEME_FILTER_ALL}>All themes</SelectItem>
              {themes.map((theme) => (
                <SelectItem key={theme.slug} value={theme.slug}>
                  {theme.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className={isInline ? "min-w-0 lg:ml-auto lg:max-w-64" : "min-w-0 flex-1 sm:max-w-64"}>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as AttemptedRiddlesSortBy)}>
          <SelectTrigger id="riddles-sort" className={triggerClassName} aria-label="Sort riddles">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ATTEMPTED_RIDDLES_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
