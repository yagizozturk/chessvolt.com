// TODO: Refactor
import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileLogoutButton } from "@/features/profile/components/profile-logout-button";
import { ProfileSoundsSwitch } from "@/features/profile/components/profile-sounds-switch";
import { ProfileUsernameForm } from "@/features/profile/components/profile-username-form";
import { UserAvatar } from "@/features/profile/components/user-avatar";
import { getUserProfile } from "@/features/profile/services/profile.service";
import { getDisplayName } from "@/features/profile/utilities/user-avatar";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "My Profile | ChessVolt",
  description: "View your ChessVolt profile and account details.",
};

export default async function Page() {
  const { user, supabase } = await getAuthenticatedUser();
  const profile = await getUserProfile(supabase, user);

  if (!profile) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t load your profile. Try signing out and back in.
        </p>
      </div>
    );
  }

  const displayName = getDisplayName(profile);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="My Profile"
          description="View your account details as you solve riddles and learn openings."
        />

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <UserAvatar
                  avatarUrl={profile.avatarUrl}
                  displayName={displayName}
                  size="lg"
                  className="size-14"
                  fallbackClassName="text-base"
                />
                <div className="space-y-1">
                  <ProfileUsernameForm initialUsername={profile.username} displayName={displayName} />
                  <CardDescription>{profile.email ?? "No email on file"}</CardDescription>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary">{profile.role === "admin" ? "Admin" : "Player"}</Badge>
                  </div>
                </div>
              </div>
              <ProfileLogoutButton iconOnly />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ProfileSoundsSwitch />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
