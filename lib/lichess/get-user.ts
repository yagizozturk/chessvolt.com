import { LICHESS_BASE_URL, lichessFetch } from "@/lib/lichess/client";
import type { LichessUser } from "@/lib/lichess/types";

export async function getLichessUser(username: string): Promise<LichessUser> {
  const normalizedUsername = username.trim().toLowerCase();
  const url = `${LICHESS_BASE_URL}/api/user/${encodeURIComponent(normalizedUsername)}`;
  const response = await lichessFetch(url);
  return (await response.json()) as LichessUser;
}
