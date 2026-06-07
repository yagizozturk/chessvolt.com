import type { LichessCsvRow } from "./lichess-import.types";

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  fields.push(current);
  return fields;
}

function toRow(fields: string[]): LichessCsvRow | null {
  if (fields.length < 10) return null;

  const rating = Number(fields[3]);
  const ratingDeviation = Number(fields[4]);
  const popularity = Number(fields[5]);

  if (!fields[0]?.trim() || !fields[1]?.trim() || !fields[2]?.trim()) return null;
  if (!Number.isFinite(rating) || !Number.isFinite(ratingDeviation) || !Number.isFinite(popularity)) {
    return null;
  }

  return {
    puzzleId: fields[0].trim(),
    fen: fields[1].trim(),
    moves: fields[2].trim(),
    rating,
    ratingDeviation,
    popularity,
    themes: fields[7]?.trim() ?? "",
    openingTags: fields[9]?.trim() ?? "",
  };
}

export function parseLichessCsv(text: string): LichessCsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const header = parseCsvLine(lines[0]);
  const hasHeader = header[0] === "PuzzleId";
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const rows: LichessCsvRow[] = [];

  for (const line of dataLines) {
    const row = toRow(parseCsvLine(line));
    if (row) rows.push(row);
  }

  return rows;
}
