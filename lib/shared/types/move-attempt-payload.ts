export type MoveAttemptPayload = {
  uci: string;
  fenBefore: string;
  playedBy: "white" | "black";
};
