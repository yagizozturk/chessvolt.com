import { apiClient } from "@/api-client/client";

export type UpdatePuzzleAnswerResponse = {
  success: boolean;
  nextPuzzleId: string | null;
};

export async function updatePuzzleAnswer(
  puzzleId: string,
  data: { isCorrect: boolean },
): Promise<{ data: UpdatePuzzleAnswerResponse }> {
  return await apiClient.post<{ data: UpdatePuzzleAnswerResponse }>(
    `/puzzle/${puzzleId}/solve`,
    data,
  );
}

export async function getPuzzleCoach(
  fen: string,
  firstMove: string,
): Promise<{ data: string }> {
  return await apiClient.post(`/puzzle/getCoach/`, { fen, firstMove });
}
