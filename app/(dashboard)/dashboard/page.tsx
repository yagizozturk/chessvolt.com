import type { Metadata } from "next";

import { getUserCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { DashboardQuickLink } from "@/features/dashboard/components/dashboard-quick-link";
import { getUserProfile } from "@/features/profile/services/profile.service";
import { getDisplayName } from "@/features/profile/utilities/user-avatar";
import { UserCollectionCard } from "@/features/user-collection/components/user-collection-card";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

const QUICK_LINKS = [
  {
    title: "My Collections",
    description: "Continue your custom practice lists.",
    href: "/user-collection",
    icon: "/images/icons/icon-book-collection.png",
  },
  {
    title: "Library",
    description: "Browse curated riddle collections.",
    href: "/collection",
    icon: "/images/icons/icon-book-collection.png",
  },
  {
    title: "Riddles",
    description: "Discover random riddles by theme.",
    href: "/riddles",
    icon: "/images/icons/icon-riddle.png",
  },
  {
    title: "Openings",
    description: "Train opening ideas and variants.",
    href: "/openings",
    icon: "/images/icons/icon-openings.png",
  },
] as const;

// ================================================================================================
// Metadata
// ================================================================================================
export const metadata: Metadata = {
  title: "Dashboard | ChessVolt",
  description: "Your ChessVolt home for collections, riddles, and openings.",
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

  const displayName = getDisplayName(profile);
  const recentCollections = userCollections.slice(0, 2);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-8">
        {/* Welcome title and message */}
        <div className="flex flex-col gap-2 rounded-xl bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)] p-6">
          <h1 className="text-3xl font-bold">Hi, {displayName}</h1>
          <p className="text-muted-foreground">
            Pick up where you left off with your collections, riddles, and openings.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <DashboardQuickLink key={link.href} {...link} />
          ))}
        </section>

        {recentCollections.length > 0 ? (
          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Your collections</h2>
                <p className="text-muted-foreground text-sm">Jump back into a recent practice list.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
