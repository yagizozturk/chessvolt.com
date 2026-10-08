const GENERIC_VARIANT_TITLES = new Set(["main line", "mainline", "the main line"]);

function plainName(value: string | null | undefined): string {
  return (value ?? "").replace(/\s*\|\s*ChessVolt\s*$/i, "").trim();
}

function withBrand(title: string): string {
  const name = plainName(title);
  return name ? `${name} | ChessVolt` : "ChessVolt";
}

function hasPhrase(value: string, phrase: string): boolean {
  return value.toLowerCase().includes(phrase.toLowerCase());
}

export function filledText(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

export function studyDocumentTitle(title: string | null | undefined): string {
  const name = plainName(title);
  if (!name) return "Chess Study | ChessVolt";
  if (hasPhrase(name, "chess study")) return withBrand(name);
  return withBrand(`${name}: Chess Study`);
}

export function studyDocumentDescription(
  title: string | null | undefined,
  description: string | null | undefined,
): string {
  const text = filledText(description);
  if (text) return text;

  const name = plainName(title);
  if (!name) {
    return "Practice chess with an interactive puzzle study. Work through instructive positions and explore the ideas behind the moves.";
  }

  return `Explore ${name}, an interactive chess study. Work through instructive positions and understand the ideas behind the moves.`;
}

export function themeDocumentTitle(title: string | null | undefined): string {
  const name = plainName(title);
  if (!name) return "Themed Chess Puzzles | ChessVolt";
  if (hasPhrase(name, "chess puzzles")) return withBrand(name);
  return withBrand(`${name} Chess Puzzles`);
}

export function themeDocumentDescription(
  title: string | null | undefined,
  description: string | null | undefined,
): string {
  const text = filledText(description);
  if (text) return text;

  const name = plainName(title);
  if (!name) {
    return "Practice chess puzzles grouped by theme. Build your calculation skills and learn to recognize patterns in your own games.";
  }

  return `Solve chess puzzles from the ${name} collection. Practice calculating moves and recognizing patterns you can use in your own games.`;
}

export function openingDocumentTitle(name: string | null | undefined): string {
  const openingName = plainName(name);
  if (!openingName) return "Chess Opening Training | ChessVolt";
  if (hasPhrase(openingName, "moves & variations")) return withBrand(openingName);
  return withBrand(`${openingName}: Moves & Variations`);
}

export function openingDocumentDescription(
  name: string | null | undefined,
  description: string | null | undefined,
): string {
  const text = filledText(description);
  if (text) return text;

  const openingName = plainName(name);
  if (!openingName) {
    return "Practice chess openings and their variations move by move. Learn the key ideas behind the moves and prepare for your next game.";
  }

  return `Learn the ${openingName} with interactive opening practice. Explore key variations, rehearse the moves and understand the ideas behind them.`;
}

export function variantDocumentTitle(
  variantTitle: string | null | undefined,
  openingName: string | null | undefined,
): string {
  const title = plainName(variantTitle);
  const opening = plainName(openingName);

  if (!title && opening) return withBrand(`${opening}: Opening Practice`);
  if (!title) return "Chess Opening Variation | ChessVolt";

  const isGeneric = GENERIC_VARIANT_TITLES.has(title.toLowerCase());
  if (isGeneric && opening && !hasPhrase(title, opening)) {
    return withBrand(`${opening}: ${title}`);
  }

  return withBrand(title);
}

export function variantDocumentDescription(
  variantTitle: string | null | undefined,
  description: string | null | undefined,
): string {
  const text = filledText(description);
  if (text) return text;

  const title = plainName(variantTitle);
  if (!title) {
    return "Practice a chess opening variation move by move. Understand the key ideas behind the sequence and reinforce the moves through repetition.";
  }

  return `Practice ${title} move by move. Understand the key ideas behind this chess opening variation and reinforce the moves through repetition.`;
}
