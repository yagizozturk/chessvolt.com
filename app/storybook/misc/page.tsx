import { IterationBadge } from "@/components/badge/number-badge/number-badge";
import { BoardStatusIcon } from "@/components/board-status-icon/board-status-icon";

import { CodeViewer } from "../components/code-viewer";
import { StorybookPage } from "../page";

export default function MiscPage() {
  return (
    <StorybookPage>
      <section className="space-y-6">
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">Misc</h2>
          <p className="text-muted-foreground mt-1 text-sm">IterationBadge bileseninin ornek kullanimi.</p>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
          <div className="flex items-center gap-3">
            <IterationBadge num={1} />
            <IterationBadge num={2} />
            <IterationBadge num={3} />
            <IterationBadge num={12} />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Component:</span> IterationBadge
            </p>
            <CodeViewer
              code={`<IterationBadge num={1} />
<IterationBadge num={2} />
<IterationBadge num={3} />
<IterationBadge num={12} />`}
            />
          </div>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
          <div className="flex items-center gap-4">
            <div className="bg-background relative h-20 w-20 rounded-md border">
              <BoardStatusIcon status="solved" />
            </div>
            <div className="bg-background relative h-20 w-20 rounded-md border">
              <BoardStatusIcon status="wrong" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Component:</span> BoardStatusIcon
            </p>
            <CodeViewer
              code={`<div className="relative h-20 w-20">
  <BoardStatusIcon status="solved" />
</div>

<div className="relative h-20 w-20">
  <BoardStatusIcon status="wrong" />
</div>`}
            />
          </div>
        </div>
      </section>
    </StorybookPage>
  );
}
