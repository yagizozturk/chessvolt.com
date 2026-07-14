export type LichessPerf = {
  games?: number;
  rating?: number;
  rd?: number;
  prog?: number;
};

export type LichessUser = {
  id: string;
  username: string;
  perfs?: {
    rapid?: LichessPerf;
    blitz?: LichessPerf;
    bullet?: LichessPerf;
    classical?: LichessPerf;
    puzzle?: LichessPerf;
  };
};
