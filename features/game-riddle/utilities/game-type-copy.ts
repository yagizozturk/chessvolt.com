import {
  DEFAULT_QUOTE,
  GAME_TYPE_QUOTES,
} from "../../../lib/shared/constants/quote";

export type GameTypeCopy = {
  description: string;
  quote: string;
  author: string;
};

export const GAME_TYPE_DESCRIPTIONS: Record<string, string> = {
  legend_games:
    "Replay historic games from chess legends. Find their moves and learn to think.",
  opening_crusher:
    "Master your repertoire with Opening Crusher. Step into the shoes of the greats and dominate from move one.",
};

export const DEFAULT_DESCRIPTION =
  "Master the tactics in this collection and sharpen your chess intuition.";

export function formatGameType(slugOrGameType: string): string {
  return slugOrGameType
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function gameTypeToSlug(gameType: string): string {
  return gameType.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
}

export function getGameTypeCopy(gameType: string): GameTypeCopy {
  const quote = GAME_TYPE_QUOTES[gameType] ?? DEFAULT_QUOTE;
  const description = GAME_TYPE_DESCRIPTIONS[gameType] ?? DEFAULT_DESCRIPTION;
  return { description, quote: quote.quote, author: quote.author };
}
