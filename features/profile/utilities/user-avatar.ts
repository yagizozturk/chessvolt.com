import type { User } from "@supabase/supabase-js";

export function getAvatarUrlFromUser(user: User | null | undefined): string | null {
  if (!user?.user_metadata || typeof user.user_metadata !== "object") {
    return null;
  }

  const { avatar_url, picture } = user.user_metadata as {
    avatar_url?: unknown;
    picture?: unknown;
  };

  const avatarUrl = avatar_url ?? picture;
  return typeof avatarUrl === "string" && avatarUrl.length > 0 ? avatarUrl : null;
}

export function getDisplayName(input: { username?: string | null; email?: string | null }): string {
  return input.username ?? input.email ?? "User";
}

export function getInitialsFromDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}
