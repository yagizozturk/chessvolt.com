export type GameTypeDetails = {
  description: string;
  quote: string;
  author: string;
};

export const DEFAULT_GAME_TYPE_DETAILS: GameTypeDetails = {
  description: "Challenge yourself with chess puzzles.",
  quote: "The only way to get smarter is by playing a smarter opponent.",
  author: "Fundamentals of Chess",
};

export const GAME_TYPE_DETAILS: Record<string, GameTypeDetails> = {
  legend_games: {
    quote: "Chess is life in miniature.",
    author: "Garry Kasparov",
    description:
      "Replay historic games from chess legends. Find their moves and learn to think.",
  },
  opening_crusher: {
    quote:
      "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.",
    author: "Rudolf Spielmann",
    description:
      "Master your repertoire with Opening Crusher. Step into the shoes of the greats and dominate from move one.",
  },
};

