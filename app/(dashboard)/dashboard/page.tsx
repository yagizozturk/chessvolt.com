import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/page-header";
import { ThreeColCard } from "@/components/three-col-card/three-col-card";
import { VoltHowToCarousel } from "@/features/dashboard/components/volt-how-to-carousel";
import { QUICK_LINKS } from "@/features/dashboard/constants/quick-links";
import { getUserProfile } from "@/features/profile/services/profile.service";
import { getDisplayName } from "@/features/profile/utilities/user-avatar";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

// ================================================================================================
// Metadata of the page
// ================================================================================================
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your ChessVolt dashboard for studies, puzzles, and openings.",
};

export default async function Page() {
  const { user, supabase } = await getAuthenticatedUser();

  // ================================================================================================
  // Getting user profile
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
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Welcome title and message */}
        <PageHeader
          title={`Hi, ${displayName}`}
          description="Pick up where you left off with your studies, puzzles, and openings."
        />

        <VoltHowToCarousel />

        {/* Quick links and three column component with links */}
        <div className="page-container-grid-data-layout">
          {QUICK_LINKS.map((link) => (
            <ThreeColCard
              key={link.href}
              href={link.href}
              left={<Image src={link.icon} alt="" aria-hidden width={32} height={32} className="size-8" />}
              right={
                <ChevronRight className="text-muted-foreground size-5 transition-transform group-hover:translate-x-0.5" />
              }
            >
              <h2 className="text-lg font-bold">{link.title}</h2>
              <p className="text-muted-foreground text-sm">{link.description}</p>
            </ThreeColCard>
          ))}
        </div>
      </div>
    </div>
  );
}
