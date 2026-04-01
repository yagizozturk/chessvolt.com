export type GameTypeDetails = {
  description: string;
  quote: string;
  author: string;
};

export const DEFAULT_GAME_TYPE_DETAILS: GameTypeDetails = {
  description: "Challenge yourself with interactive chess challenges.",
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
  "60_memorable_games_of_magnus_carlsen": {
    quote:
      "I started by just sitting by the chessboard exploring things. I just played by myself. I learnt a lot from that, and I feel that it is a big reason why I now have a good intuitive understanding of chess.",
    author: "Magnus Carlsen",
    description:
      "Step into the shoes of the greatest player of all time and dominate.",
  },
};
