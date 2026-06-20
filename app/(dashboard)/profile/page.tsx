import type { Metadata } from "next";

import { getGrandVoltScore } from "@/components/calculator/volt-calculator/get-grand-volt-score";
import { ProfilePage } from "@/features/profile/components/profile-page";
import { getUserProfile } from "@/features/profile/services/profile.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "My Profile | ChessVolt",
  description: "View your ChessVolt profile, account details, and rating progress.",
};

export default async function Page() {
  const { user, supabase } = await getAuthenticatedUser();

  // ================================================================================================
  // Load profile and Grand Volt in parallel.
  // Grand Volt sums per-sequence Volt from all riddles + opening variants played in the last 3 months.
  // ================================================================================================
  const [profile, grandVoltScore] = await Promise.all([
    getUserProfile(supabase, user),
    getGrandVoltScore(supabase, user.id),
  ]);

  if (!profile) {
    return (
      <div className="container mx-auto max-w-4xl px-4 pt-6 pb-16">
        <p className="text-muted-foreground text-sm">We couldn&apos;t load your profile. Try signing out and back in.</p>
      </div>
    );
  }

  return <ProfilePage profile={profile} grandVoltScore={grandVoltScore} />;
}
