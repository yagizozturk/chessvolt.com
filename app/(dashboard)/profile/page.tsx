import type { Metadata } from "next";

import { ProfilePage } from "@/features/profile/components/profile-page";
import { getUserProfile } from "@/features/profile/services/profile.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "My Profile | ChessVolt",
  description: "View your ChessVolt profile, account details, and rating progress.",
};

export default async function Page() {
  const { user, supabase } = await getAuthenticatedUser();
  const profile = await getUserProfile(supabase, user);

  if (!profile) {
    return (
      <div className="container mx-auto max-w-4xl px-4 pt-6 pb-16">
        <p className="text-muted-foreground text-sm">We couldn&apos;t load your profile. Try signing out and back in.</p>
      </div>
    );
  }

  return <ProfilePage profile={profile} />;
}
