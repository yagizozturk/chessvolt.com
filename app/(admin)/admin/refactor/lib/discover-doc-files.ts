import fs from "fs";
import path from "path";

const DOCS_DIR = "docs";

export function discoverDocFiles(): string[] {
  const projectRoot = process.cwd();
  const docsPath = path.join(projectRoot, DOCS_DIR);

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(docsPath, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => `${DOCS_DIR}/${entry.name}`)
    .sort((a, b) => a.localeCompare(b));
}
