export type MoveEvaluationPayload = {
  uci: string;
  fenBefore: string;
  fenAfter: string;
  playedBy: "white" | "black";
};
