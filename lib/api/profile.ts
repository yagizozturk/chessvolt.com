import { apiClient } from "./client";

export type RewardResponse = {
  success: boolean;
};

export async function addReward(): Promise<{
  data: RewardResponse;
}> {
  return await apiClient.post<{ data: RewardResponse }>("/profile/reward");
}
