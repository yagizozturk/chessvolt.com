import type { Metadata } from "next";

import { getGrandVoltScore } from "@/components/calculator/volt-calculator/get-grand-volt-score";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { getUserCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getUserProfile } from "@/features/profile/services/profile.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Dashboard | ChessVolt",
  description: "Your ChessVolt home for collections, riddles, and openings.",
};

export default async function Page() {
  const { user, supabase } = await getAuthenticatedUser();

  const [profile, grandVoltScore, userCollections] = await Promise.all([
    getUserProfile(supabase, user),
    getGrandVoltScore(supabase, user.id),
    getUserCollectionsWithRiddleCountAndThemes(supabase, user.id),
  ]);

  if (!profile) {
    return (
      <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
        <p className="text-muted-foreground text-sm">We couldn&apos;t load your dashboard. Try signing out and back in.</p>
      </div>
    );
  }

  return (
    <DashboardPage
      profile={profile}
      grandVoltScore={grandVoltScore}
      recentCollections={userCollections.slice(0, 2)}
    />
  );
}
