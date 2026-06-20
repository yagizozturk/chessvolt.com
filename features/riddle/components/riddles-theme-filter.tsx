"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RIDDLES_THEME_FILTER_ALL } from "@/features/riddle/constants/riddles-list.constants";
import {
  formatRiddleRatingBandLabel,
  isRiddleRatingBand,
  RIDDLE_RATING_BAND_OPTIONS,
  type RiddleRatingBand,
} from "@/features/riddle/types/riddle-rating";
import type { Theme } from "@/features/theme/types/theme";

type RiddlesThemeFilterProps = {
  themes: Theme[];
  themeValue: string;
  ratingValue: RiddleRatingBand;
  onThemeChange: (value: string) => void;
  onRatingChange: (value: RiddleRatingBand) => void;
};

export function RiddlesThemeFilter({
  themes,
  themeValue,
  ratingValue,
  onThemeChange,
  onRatingChange,
}: RiddlesThemeFilterProps) {
  return (
    <div className="bg-muted/50 flex w-full flex-col gap-3 rounded-xl p-4 sm:flex-row sm:flex-wrap sm:items-center">
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

      <div className="min-w-0 flex-1 sm:max-w-64">
        <Select
          value={ratingValue}
          onValueChange={(value) => {
            if (isRiddleRatingBand(value)) onRatingChange(value);
          }}
        >
          <SelectTrigger id="riddles-rating" className="w-full rounded-xl border-2" aria-label="Filter by rating">
            <SelectValue placeholder="All ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {RIDDLE_RATING_BAND_OPTIONS.map((band) => (
                <SelectItem key={band} value={band}>
                  {formatRiddleRatingBandLabel(band)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
