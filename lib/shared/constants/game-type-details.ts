// TODO: Refactor
export type GameTypeDetails = {
  description: string;
  quote: string;
  author: string;
  backgroundColor: string;
};

export const DEFAULT_GAME_TYPE_DETAILS: GameTypeDetails = {
  description: "Challenge yourself with interactive chess collections.",
  quote: "The only way to get smarter is by playing a smarter opponent.",
  author: "Fundamentals of Chess",
  backgroundColor: "#5D37BF",
};

export const GAME_TYPE_DETAILS: Record<string, GameTypeDetails> = {
  "legend-games-from-tal-to-kasparov": {
    quote: "Chess is life in miniature.",
    author: "Garry Kasparov",
    description: "Replay historic games from chess legends. Find their moves and learn to think.",
    backgroundColor: "#26B8B7",
  },
  opening_crusher: {
    quote: "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.",
    author: "Rudolf Spielmann",
    description:
      "Master your repertoire with Opening Crusher. Step into the shoes of the greats and dominate from move one.",
    backgroundColor: "#5D37BF",
  },
  "best-move-contest-mate": {
    quote: "The best way to learn is to play.",
    author: "Bobby Fischer",
    description: "Play the best games from the BMC book and learn from the best.",
    backgroundColor: "#784AED",
  },
  "60-memorable-games-of-magnus-carlsen": {
    quote:
      "I started by just sitting by the board exploring things. I just played by myself. I learnt a lot from that.",
    author: "Magnus Carlsen",
    description: "Step into the shoes of the greatest player of all time and dominate.",
    backgroundColor: "#5D37BF",
  },
  "instructive-chess-miniatures": {
    quote: "The best way to learn is to play.",
    author: "Bobby Fischer",
    description: "Play the best games from the BMC book and learn from the best.",
    backgroundColor: "#4B24BE",
  },
};
