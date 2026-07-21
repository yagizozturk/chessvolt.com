// TODO: Refactor
import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { DashboardQuickLink } from "@/features/dashboard/components/dashboard-quick-link";
import { QUICK_LINKS } from "@/features/dashboard/constants/quick-links";
import { getUserProfile } from "@/features/profile/services/profile.service";
import { getDisplayName } from "@/features/profile/utilities/user-avatar";
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
  const profile = await getUserProfile(supabase, user);

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
  // Getting display name
  // ================================================================================================
  const displayName = getDisplayName(profile);

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

      </div>
    </div>
  );
}
