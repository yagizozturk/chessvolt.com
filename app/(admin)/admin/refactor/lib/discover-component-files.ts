import fs from "fs";
import path from "path";

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build"]);

function isComponentTsxFile(absolutePath: string) {
  return (
    absolutePath.endsWith(".tsx") &&
    absolutePath.split(path.sep).includes("components")
  );
}

function walkDirectory(dir: string, results: string[], projectRoot: string) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (SKIP_DIRS.has(entry.name)) continue;

    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkDirectory(absolutePath, results, projectRoot);
      continue;
    }

    if (!entry.isFile() || !isComponentTsxFile(absolutePath)) continue;

    results.push(
      path.relative(projectRoot, absolutePath).split(path.sep).join("/"),
    );
  }
}

export function discoverComponentFiles(): string[] {
  const projectRoot = process.cwd();
  const results: string[] = [];
  walkDirectory(projectRoot, results, projectRoot);
  return results.sort((a, b) => a.localeCompare(b));
}
