// TODO: Refactor
export type ProfileRole = "user" | "admin";

/** Client hook’tan gelen profil; `null` = oturum yok veya yükleme hatası. */
export type Profile = {
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: ProfileRole;
  onboardingCompleted: boolean;
  initialRating: number | null;
  currentRating: number | null;
  chesscomUsername: string | null;
  lichessUsername: string | null;
} | null;
