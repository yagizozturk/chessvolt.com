import {
  DEFAULT_GAME_TYPE_DETAILS,
  GAME_TYPE_DETAILS,
} from "@/lib/shared/constants/game-type-details";

export type GameTypeDetails = {
  description: string;
  quote: string;
  author: string;
};

export function formatGameType(slugOrGameType: string): string {
  return slugOrGameType
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function gameTypeToSlug(gameType: string): string {
  return gameType.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
}

export function getGameTypeConstants(gameType: string): GameTypeDetails {
  const details = GAME_TYPE_DETAILS[gameType] ?? DEFAULT_GAME_TYPE_DETAILS;
  return {
    description: details.description,
    quote: details.quote,
    author: details.author,
  };
}
