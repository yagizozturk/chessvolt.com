import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { getUserCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { DashboardQuickLink } from "@/features/dashboard/components/dashboard-quick-link";
import { QUICK_LINKS } from "@/features/dashboard/constants/quick-links";
import { getUserProfile } from "@/features/profile/services/profile.service";
import { getDisplayName } from "@/features/profile/utilities/user-avatar";
import { UserCollectionCard } from "@/features/user-collection/components/user-collection-card";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

// ================================================================================================
// Metadata of the page
// ================================================================================================
export const metadata: Metadata = {
  title: "Dashboard | ChessVolt",
  description: "Your ChessVolt dashboard for collections, riddles, and openings.",
};

export default async function Page() {
  const { user, supabase } = await getAuthenticatedUser();

  // ================================================================================================
  // Getting user profile and user collections
  // ================================================================================================
  const [profile, userCollections] = await Promise.all([
    getUserProfile(supabase, user),
    getUserCollectionsWithRiddleCountAndThemes(supabase, user.id),
  ]);

  // ================================================================================================
  // If user profile is not found, return an error message
  // ================================================================================================
  if (!profile) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <p className="text-muted-foreground text-sm">
          We could not load your dashboard. Please try signing out and back in.
        </p>
      </div>
    );
  }

  // ================================================================================================
  // Getting display name and recent collections
  // ================================================================================================
  const displayName = getDisplayName(profile);
  const recentCollections = userCollections.slice(0, 2);

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-4 pb-10 md:pt-10">
      <div className="flex flex-col gap-8">
        {/* Welcome title and message */}
        <PageHeader
          title={`Hi, ${displayName}`}
          description="Pick up where you left off with your collections, riddles, and openings."
        />

        {/* Quick links */}
        <section className="grid gap-4 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <DashboardQuickLink key={link.href} {...link} />
          ))}
        </section>

        {/* Recent collections */}
        {recentCollections.length > 0 ? (
          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold md:text-2xl">Your collections</h2>
                <p className="text-muted-foreground text-sm md:text-base">Jump back into a recent practice list.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {recentCollections.map((collection) => (
                <UserCollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
