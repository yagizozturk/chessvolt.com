export type RiddlePathContext = {
  collectionSlug: string;
};

export type StandaloneRiddleSource = "favorites" | "riddles";

export function buildStandaloneRiddlePath(
  riddleId: string,
  options?: { from?: StandaloneRiddleSource },
): string {
  const path = `/riddles/${riddleId}`;
  if (options?.from === "favorites") {
    return `${path}?from=favorites`;
  }
  return path;
}

export function parseStandaloneRiddleSource(from?: string | null): StandaloneRiddleSource | undefined {
  if (from === "favorites") return "favorites";
  if (from === "riddles") return "riddles";
  return undefined;
}

export function getStandaloneRiddleBackUrl(from?: StandaloneRiddleSource | null): string {
  if (from === "favorites") return "/favorites";
  return "/riddles";
}

export function buildRiddlePath(riddleId: string, { collectionSlug }: RiddlePathContext): string {
  return `/collection/${collectionSlug}/riddle/${riddleId}`;
}
