import type { LichessCsvRow } from "./types";

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

function rowFromFields(fields: Record<string, string>): LichessCsvRow | null {
  const rating = Number(fields.Rating);
  const popularity = Number(fields.Popularity);

  if (!fields.PuzzleId?.trim() || !fields.FEN?.trim() || !fields.Moves?.trim()) return null;
  if (!Number.isFinite(rating) || !Number.isFinite(popularity)) return null;

  return {
    puzzleId: fields.PuzzleId.trim(),
    fen: fields.FEN.trim(),
    moves: fields.Moves.trim(),
    rating,
    popularity,
    themes: fields.Themes?.trim() ?? "",
    openingTags: fields.OpeningTags?.trim() ?? "",
  };
}

function rowFromPositions(fields: string[]): LichessCsvRow | null {
  const rating = Number(fields[3]);
  const popularity = Number(fields[4]);

  if (!fields[0]?.trim() || !fields[1]?.trim() || !fields[2]?.trim()) return null;
  if (!Number.isFinite(rating) || !Number.isFinite(popularity)) return null;

  return {
    puzzleId: fields[0].trim(),
    fen: fields[1].trim(),
    moves: fields[2].trim(),
    rating,
    popularity,
    themes: fields[5]?.trim() ?? "",
    openingTags: fields[6]?.trim() ?? "",
  };
}

export function parseLichessCsv(text: string): LichessCsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const header = parseCsvLine(lines[0]!);
  const hasHeader = header[0] === "PuzzleId";
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const rows: LichessCsvRow[] = [];

  for (const line of dataLines) {
    const fields = parseCsvLine(line);

    if (hasHeader) {
      const byName: Record<string, string> = {};
      header.forEach((name, i) => {
        byName[name] = fields[i] ?? "";
      });
      const row = rowFromFields(byName);
      if (row) rows.push(row);
    } else {
      const row = rowFromPositions(fields);
      if (row) rows.push(row);
    }
  }

  return rows;
}
