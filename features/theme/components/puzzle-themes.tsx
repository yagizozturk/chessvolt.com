"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeList } from "@/features/theme/components/theme-list";
import type { Theme } from "@/features/theme/types/theme";
import { buildThemeFilterUrl, filterThemes } from "@/features/theme/utilities/theme-filter.utils";

type PuzzleThemesProps = {
  themes: Theme[];
};

export function PuzzleThemes({ themes }: PuzzleThemesProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    window.history.replaceState(null, "", buildThemeFilterUrl(searchQuery));
  }, [searchQuery]);

  const filteredThemes = filterThemes(themes, searchQuery);
  const hasActiveFilter = searchQuery.trim() !== "";

  return (
    <>
      <PageHeader
        title="Puzzle Themes"
        description="Browse through the available puzzle themes."
        actions={
          themes.length > 0 ? (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <div className="min-w-0 sm:max-w-xs sm:flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search themes..."
                  aria-label="Search themes"
                  className="bg-background"
                />
              </div>
              {hasActiveFilter && (
                <Button type="button" variant="volt" size="sm" onClick={() => setSearchQuery("")}>
                  Clear
                </Button>
              )}
            </div>
          ) : undefined
        }
      />

      {themes.length === 0 ? (
        <EmptyDataMessage message="No themes available yet." />
      ) : filteredThemes.length === 0 ? (
        <EmptyDataMessage message="No themes match your search." />
      ) : (
        <ThemeList themes={filteredThemes} />
      )}
    </>
  );
}
