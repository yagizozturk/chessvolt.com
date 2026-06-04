import { RefactorChecklist } from "./components/refactor-checklist";
import { buildFolderTree } from "./lib/build-folder-tree";
import { discoverComponentFiles } from "./lib/discover-component-files";

export default function AdminRefactorPage() {
  const paths = discoverComponentFiles();
  const tree = buildFolderTree(paths);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Refactor tracker</h1>
        <p className="text-muted-foreground">
          All <code className="text-sm">.tsx</code> files under{" "}
          <code className="text-sm">components/</code> folders, grouped by path.
          Check off each file as you refactor it.
        </p>
      </div>

      <RefactorChecklist tree={tree} allPaths={paths} />
    </div>
  );
}
