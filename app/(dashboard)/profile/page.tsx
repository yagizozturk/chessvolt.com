import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/features/profile/components/user-avatar";
import { getUserProfile } from "@/features/profile/services/profile.service";
import { getDisplayName } from "@/features/profile/utilities/user-avatar";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "My Profile | ChessVolt",
  description: "View your ChessVolt profile, account details, and rating progress.",
};

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background/40 p-4">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

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
  const ratingGain =
    profile.initialRating != null && profile.currentRating != null
      ? profile.currentRating - profile.initialRating
      : null;

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-6 pb-16">
      <div className="flex flex-col gap-6">
        <div className="flex gap-2 rounded-lg bg-[#113DC4]">
          <div className="min-w-0 flex-1 space-y-2 p-4">
            <p className="text-primary text-sm font-semibold">Your ChessVolt account</p>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="max-w-xl text-sm text-white/80">
              Track your account details and rating progress as you solve riddles and learn openings.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg p-4">
            <UserAvatar
              avatarUrl={profile.avatarUrl}
              displayName={displayName}
              size="lg"
              className="size-24"
              fallbackClassName="text-2xl"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <UserAvatar
                avatarUrl={profile.avatarUrl}
                displayName={displayName}
                size="lg"
                className="size-14"
                fallbackClassName="text-base"
              />
              <div className="space-y-1">
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                <CardDescription>{profile.email ?? "No email on file"}</CardDescription>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary">{profile.role === "admin" ? "Admin" : "Player"}</Badge>
                  <Badge variant={profile.onboardingCompleted ? "default" : "outline"}>
                    {profile.onboardingCompleted ? "Onboarding complete" : "Onboarding pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <ProfileStat
              label="Current rating"
              value={profile.currentRating != null ? String(profile.currentRating) : "—"}
            />
            <ProfileStat
              label="Starting rating"
              value={profile.initialRating != null ? String(profile.initialRating) : "—"}
            />
            <ProfileStat
              label="Rating gain"
              value={ratingGain != null ? (ratingGain >= 0 ? `+${ratingGain}` : String(ratingGain)) : "—"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
