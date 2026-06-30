"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RIDDLES_THEME_FILTER_ALL } from "@/features/riddle/constants/riddles-list.constants";
import type { Theme } from "@/features/theme/types/theme";

type RiddlesThemeFilterProps = {
  themes: Theme[];
  themeValue: string;
  onThemeChange: (value: string) => void;
};

export function RiddlesThemeFilter({ themes, themeValue, onThemeChange }: RiddlesThemeFilterProps) {
  return (
    <div className="min-w-0 flex-1 sm:max-w-64">
      <Select value={themeValue} onValueChange={onThemeChange} disabled={themes.length === 0}>
        <SelectTrigger id="riddles-theme" className="w-full rounded-xl border-2" aria-label="Filter by theme">
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
  );
}
