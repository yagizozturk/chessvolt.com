import Image from "next/image";

import type { GrandVoltScoreResult } from "@/components/calculator/volt-calculator/grand-volt.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfileData } from "@/features/profile/types/user-profile";

type ProfilePageProps = {
  profile: UserProfileData;
  /** Aggregated Volt from riddles + opening variants (computed server-side on page load). */
  grandVoltScore: GrandVoltScoreResult;
};

function getDisplayName(profile: UserProfileData) {
  return profile.username ?? profile.email ?? "User";
}

function getInitials(profile: UserProfileData) {
  const name = getDisplayName(profile);
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background/40 p-4">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export function ProfilePage({ profile, grandVoltScore }: ProfilePageProps) {
  const displayName = getDisplayName(profile);
  const ratingGain =
    profile.initialRating != null && profile.currentRating != null
      ? profile.currentRating - profile.initialRating
      : null;
  // Show "—" when the user has no qualifying attempts in the lookback window.
  const hasGrandVoltActivity = grandVoltScore.sequenceCount > 0;

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
          <div className="overflow-hidden rounded-lg">
            <Image
              src="/images/icons/icon-user-profile.png"
              alt=""
              width={120}
              height={120}
              className="object-contain p-4"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar size="lg" className="size-14">
                <AvatarFallback className="text-base font-semibold">{getInitials(profile)}</AvatarFallback>
              </Avatar>
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

        {/* Grand Volt: sum of per-sequence Volt scores across riddles and opening variants. */}
        <Card>
          <CardHeader>
            <CardTitle>Grand Volt</CardTitle>
            <CardDescription>
              Total Volt earned from riddles and opening variants in the last {grandVoltScore.lookbackMonths} months.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {/* volt / maxVolt — max grows with each sequence played (sequenceCount × getVoltMaxScore()). */}
            <ProfileStat
              label="Grand Volt"
              value={
                hasGrandVoltActivity
                  ? `${grandVoltScore.volt}/${grandVoltScore.maxVolt}`
                  : "—"
              }
            />
            <ProfileStat
              label="From riddles"
              value={hasGrandVoltActivity ? String(grandVoltScore.riddleVolt) : "—"}
            />
            <ProfileStat
              label="From openings"
              value={hasGrandVoltActivity ? String(grandVoltScore.openingVariantVolt) : "—"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
