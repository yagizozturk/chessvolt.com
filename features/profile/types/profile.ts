export type ProfileRole = "user" | "admin";

/** Client hook’tan gelen profil; `null` = oturum yok veya yükleme hatası. */
export type Profile = {
  username: string | null;
  role: ProfileRole;
} | null;
