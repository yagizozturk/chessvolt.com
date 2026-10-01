"use client";

import { useEffect, useState } from "react";

import type { Profile, ProfileRole } from "@/features/profile/types/profile";
import { getAvatarUrlFromUser } from "@/features/profile/utilities/user-avatar";
import { createClient } from "@/lib/supabase/client";

// One in-flight load shared by Strict Mode remounts and every useProfile() caller.
let inFlightProfile: Promise<Profile> | null = null;

function loadProfile(): Promise<Profile> {
  if (!inFlightProfile) {
    inFlightProfile = fetchProfile(createClient()).finally(() => {
      inFlightProfile = null;
    });
  }

  return inFlightProfile;
}

async function fetchProfile(supabase: ReturnType<typeof createClient>): Promise<Profile> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "username, role, onboarding_completed, initial_rating, current_rating, chesscom_username, lichess_username",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("useProfile fetch error:", error.message ?? error.code ?? error);
    return null;
  }

  return {
    username: data?.username ?? null,
    email: user.email ?? null,
    avatarUrl: getAvatarUrlFromUser(user),
    role: (data?.role as ProfileRole) ?? "user",
    onboardingCompleted: data?.onboarding_completed ?? false,
    initialRating: data?.initial_rating ?? null,
    currentRating: data?.current_rating ?? null,
    chesscomUsername: data?.chesscom_username ?? null,
    lichessUsername: data?.lichess_username ?? null,
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    let requestId = 0;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;

    function publish(id: number, next: Profile) {
      if (!active || id !== requestId) return;
      setProfile(next);
      setIsLoading(false);
    }

    const initialId = ++requestId;
    void loadProfile().then((next) => publish(initialId, next));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // INITIAL_SESSION repeats the load above. Defer later refetches so getUser
      // does not run inside the auth lock (supabase-js deadlocks if it does).
      if (event === "INITIAL_SESSION") return;

      const id = ++requestId;
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        void fetchProfile(supabase).then((next) => publish(id, next));
      }, 0);
    });

    return () => {
      active = false;
      clearTimeout(refreshTimer);
      subscription.unsubscribe();
    };
  }, []);

  return { profile, isLoading };
}
