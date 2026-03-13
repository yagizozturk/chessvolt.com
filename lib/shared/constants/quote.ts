export type Quote = {
  quote: string;
  author: string;
};

export const GAME_TYPE_QUOTES: Record<string, Quote> = {
  legend_games: {
    quote: "Chess is life in miniature.",
    author: "Garry Kasparov",
  },
  opening_crusher: {
    quote:
      "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.",
    author: "Rudolf Spielmann",
  },
};

export const DEFAULT_QUOTE: Quote = {
  quote: "Chess is the gymnasium of the mind.",
  author: "Blaise Pascal",
};
