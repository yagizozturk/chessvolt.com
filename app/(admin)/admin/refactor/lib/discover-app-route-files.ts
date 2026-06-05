import fs from "fs";
import path from "path";

const APP_DIR = "app";
const ROUTE_FILE_NAMES = new Set(["page.tsx", "layout.tsx", "loading.tsx", "route.ts"]);

function isAppRouteFile(fileName: string) {
  return ROUTE_FILE_NAMES.has(fileName);
}

function walkAppDirectory(dir: string, results: string[], projectRoot: string) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkAppDirectory(absolutePath, results, projectRoot);
      continue;
    }

    if (!entry.isFile() || !isAppRouteFile(entry.name)) continue;

    results.push(
      path.relative(projectRoot, absolutePath).split(path.sep).join("/"),
    );
  }
}

export function discoverAppRouteFiles(): string[] {
  const projectRoot = process.cwd();
  const appPath = path.join(projectRoot, APP_DIR);
  const results: string[] = [];
  walkAppDirectory(appPath, results, projectRoot);
  return results.sort((a, b) => a.localeCompare(b));
}
