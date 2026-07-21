export type RiddlePathContext = {
  collectionSlug: string;
};

export function buildStandaloneRiddlePath(riddleId: string): string {
  return `/riddles/${riddleId}`;
}

export function buildRiddlePath(
  riddleId: string,
  { collectionSlug }: RiddlePathContext,
): string {
  return `/collection/${collectionSlug}/riddle/${riddleId}`;
}
