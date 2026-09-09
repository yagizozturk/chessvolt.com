import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AnalysisView } from "@/features/analysis";
import { importedGameHref } from "@/features/analysis/utilities/imported-game-label";
import { isGameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Analysis | ChessVolt",
  description: "Review your recent Chess.com and Lichess games.",
};

type SearchParams = Promise<{ platform?: string; id?: string }>;

export default async function AnalysisPage({ searchParams }: { searchParams: SearchParams }) {
  await getAuthenticatedUser();
  const params = await searchParams;

  if (isGameAnalysisSource(params.platform) && params.id?.trim()) {
    redirect(importedGameHref(params.platform, params.id.trim()));
  }

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <AnalysisView />
      </div>
    </div>
  );
}
