export const VALID_PGN_EXAMPLE = `[Event "BMC Book"]
[Site "?"]
[Date "2018.08.28"]
[Round "?"]
[White "1-1"]
[Black "?"]
[Result "*"]
[SetUp "1"]
[FEN "2Rr2k1/pp2Qppp/1q6/8/8/7P/PP1r1PP1/2R3K1 w - - 0 1"]
[PlyCount "3"]

1. Qe8+ Rxe8 2. Rxe8# *`;

export const GOALS_JSON_EXAMPLE = JSON.stringify(
  [
    {
      ply: 1,
      move: "e7e8",
      title: "...",
      description: "...",
      isCompleted: false,
    },
  ],
  null,
  2,
);
