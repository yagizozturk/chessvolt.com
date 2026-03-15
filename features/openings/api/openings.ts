import { apiClient } from "@/api-client/client";

export type UpdateOpeningVariantAnswerResponse = {
  success: boolean;
};

export async function updateOpeningVariantAnswer(
  openingVariantId: string,
  data: { isCorrect: boolean },
): Promise<{ data: UpdateOpeningVariantAnswerResponse }> {
  return await apiClient.post<{ data: UpdateOpeningVariantAnswerResponse }>(
    `/opening-variant/${openingVariantId}/solve`,
    data,
  );
}
