import VoltBoardLegacy from "@/components/volt-board-legacy/volt-board-legacy";

import { CodeViewer } from "../components/code-viewer";
import { StorybookPage } from "../page";

export default function StorybookBoardPage() {
  return (
    <StorybookPage>
      <section className="space-y-6">
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">Board</h2>
          <p className="text-muted-foreground mt-1 text-sm">VoltBoardLegacy bileşeninin örnek kullanımı.</p>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
          <div className="flex items-start justify-center">
            <VoltBoardLegacy
              sourceId="storybook-board"
              moves="e2e4 e7e5 g1f3 b8c6 f1c4 g8f6"
              width={520}
              height={520}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Component:</span> VoltBoardLegacy
            </p>
            <CodeViewer
              code={`<VoltBoardLegacy
  sourceId="storybook-board"
  moves="e2e4 e7e5 g1f3 b8c6 f1c4 g8f6"
  initialFen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  width={520}
  height={520}
  className="mx-auto"
  viewOnly={false}
  coordinates={true}
  onUserMovePlayed={(uci) => console.log("move:", uci)}
  onUserSuccessMovePlayed={() => console.log("correct move")}
  onFenAfterUserMove={(fen) => console.log("fen after user:", fen)}
  onFenAfterOpponentMove={(fen) => console.log("fen after opponent:", fen)}
  onSolved={(isCorrect) => console.log("solved:", isCorrect)}
/>`}
            />
          </div>
        </div>
      </section>
    </StorybookPage>
  );
}
