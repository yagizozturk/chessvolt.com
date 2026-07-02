import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileLogoutButton } from "@/features/profile/components/profile-logout-button";
import { ProfileSoundsSwitch } from "@/features/profile/components/profile-sounds-switch";
import { ProfileThemeSwitch } from "@/features/profile/components/profile-theme-switch";
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
      <div className="container mx-auto max-w-4xl px-4 pt-6 pb-16">
        <p className="text-muted-foreground text-sm">We couldn&apos;t load your profile. Try signing out and back in.</p>
      </div>
    );
  }

  const displayName = getDisplayName(profile);

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-6 pb-16">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 rounded-xl bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)] p-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            View your account details as you solve riddles and learn openings.
          </p>
        </div>

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
              <ProfileLogoutButton />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your ChessVolt experience.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ProfileThemeSwitch />
            <ProfileSoundsSwitch />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
