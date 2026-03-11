import { apiClient } from "./client";

export type UpdateGameRiddleAnswerResponse = {
  success: boolean;
};

export async function updateGameRiddleAnswer(
  gameRiddleId: string,
  data: { isCorrect: boolean },
): Promise<{ data: UpdateGameRiddleAnswerResponse }> {
  return await apiClient.post<{ data: UpdateGameRiddleAnswerResponse }>(
    `/game-riddle/${gameRiddleId}/solve`,
    data,
  );
}
