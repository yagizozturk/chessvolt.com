export type Move = {
  from: string;
  to: string;
  promotion?: string;
  san?: string;
  uci?: string;
};