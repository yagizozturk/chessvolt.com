"use client";

import type { Profile, ProfileRole } from "@/features/profile/types/profile";
import { getAvatarUrlFromUser } from "@/features/profile/utilities/user-avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username, role, onboarding_completed, initial_rating, current_rating")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("useProfile fetch error:", error.message ?? error.code ?? error);
        setProfile(null);
      } else {
        setProfile({
          username: data?.username ?? null,
          email: user.email ?? null,
          avatarUrl: getAvatarUrlFromUser(user),
          role: (data?.role as ProfileRole) ?? "user",
          onboardingCompleted: data?.onboarding_completed ?? false,
          initialRating: data?.initial_rating ?? null,
          currentRating: data?.current_rating ?? null,
        });
      }
      setIsLoading(false);
    }

    fetchProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { profile, isLoading };
}
