import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/page-header/page-header";
import { ImportedGamesList } from "@/features/game-review/components/imported-games-list";
import { importedGameHref } from "@/features/game-review/utilities/imported-game-label";
import { isGameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Game review | ChessVolt",
  description: "Review your recent Chess.com and Lichess games.",
};

type SearchParams = Promise<{ platform?: string; id?: string }>;

export default async function GameReviewIndexPage({ searchParams }: { searchParams: SearchParams }) {
  await getAuthenticatedUser();
  const params = await searchParams;

  if (isGameAnalysisSource(params.platform) && params.id?.trim()) {
    redirect(importedGameHref(params.platform, params.id.trim()));
  }

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Game analysis"
          description="Load your recent Chess.com and Lichess games, then pick one to review."
        />
        <ImportedGamesList />
      </div>
    </div>
  );
}
