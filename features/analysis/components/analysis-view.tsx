"use client";

import { PageHeader } from "@/components/page-header";
import { ImportedGamesList } from "@/features/analysis/components/imported-games-list";

export function AnalysisView() {
  return (
    <>
      <PageHeader
        title="Game analysis"
        description="Load your recent Chess.com and Lichess games, then pick one to review."
      />
      <ImportedGamesList />
    </>
  );
}
