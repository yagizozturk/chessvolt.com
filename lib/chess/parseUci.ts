export type ParsedUci = {
  from: string;
  to: string;
  promotion?: string;
};

export function parseUci(uci: string): ParsedUci | null {
  if (!uci || uci.length < 4) return null;

  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? uci[4] : undefined;

  return { from, to, promotion };
}
