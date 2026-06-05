import { RefactorChecklist } from "./components/refactor-checklist";
import { buildFolderTree } from "./lib/build-folder-tree";
import { discoverAppRouteFiles } from "./lib/discover-app-route-files";
import { discoverComponentFiles } from "./lib/discover-component-files";
import { discoverDocFiles } from "./lib/discover-doc-files";

export default function AdminRefactorPage() {
  const componentPaths = discoverComponentFiles();
  const componentTree = buildFolderTree(componentPaths);

  const appRoutePaths = discoverAppRouteFiles();
  const appRouteTree = buildFolderTree(appRoutePaths);

  const docPaths = discoverDocFiles();
  const docTree = buildFolderTree(docPaths);

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Refactor tracker</h1>
        <p className="text-muted-foreground">
          Track refactor and review progress for app routes, components, and docs. Check off each
          item as you work through it.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">App routes</h2>
          <p className="text-muted-foreground text-sm">
            <code className="text-sm">page.tsx</code>,{" "}
            <code className="text-sm">layout.tsx</code>,{" "}
            <code className="text-sm">loading.tsx</code>, and{" "}
            <code className="text-sm">route.ts</code> under <code className="text-sm">app/</code>{" "}
            (includes <code className="text-sm">(auth)</code>,{" "}
            <code className="text-sm">(dashboard)</code>, etc.).
          </p>
        </div>
        <RefactorChecklist
          tree={appRouteTree}
          allPaths={appRoutePaths}
          storageKey="chessvolt-admin-refactor-app-routes"
          itemLabel="app routes"
          emptyMessage="No app routes match your filters."
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Components</h2>
          <p className="text-muted-foreground text-sm">
            All <code className="text-sm">.tsx</code> files under{" "}
            <code className="text-sm">components/</code> folders.
          </p>
        </div>
        <RefactorChecklist
          tree={componentTree}
          allPaths={componentPaths}
          storageKey="chessvolt-admin-refactor-done"
          itemLabel="components"
          emptyMessage="No components match your filters."
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Docs</h2>
          <p className="text-muted-foreground text-sm">
            All <code className="text-sm">.md</code> files under{" "}
            <code className="text-sm">docs/</code>. Start with{" "}
            <code className="text-sm">product-map.md</code>.
          </p>
        </div>
        <RefactorChecklist
          tree={docTree}
          allPaths={docPaths}
          storageKey="chessvolt-admin-refactor-docs"
          itemLabel="docs"
          emptyMessage="No docs match your filters."
        />
      </section>
    </div>
  );
}
