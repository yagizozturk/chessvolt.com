export function parseRiddlePopularity(value: unknown): number | null {
  if (value == null) return null;
  const raw = typeof value === "number" ? value : String(value).trim();
  if (raw === "") return null;
  const num = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(num) ? num : null;
}
