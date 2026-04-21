export function buildUci(from: string, to: string, promotion?: string): string {
  return `${from}${to}${promotion ?? ""}`;
}
