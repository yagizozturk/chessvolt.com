"use client";

import VoltBoard from "@/components/boards/volt-board/volt-board";

import { CodeViewer } from "../components/code-viewer";
import { StorybookPage } from "../page";

export default function StorybookBoardPage() {
  return (
    <StorybookPage>
      <section className="space-y-6">
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">Board</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            `VoltBoard` bileşeninin storybook anlatımı ve örnek kullanımı.
          </p>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
          <div className="flex items-start justify-center">
            <VoltBoard
              sourceId="storybook-board"
              initialFen="r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3"
              size={520}
              viewOnly
              onCheckMove={() => true}
              onSuccessMovePlayed={() => {}}
              onNextMoveRequest={() => undefined}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Component:</span> VoltBoard
            </p>
            <p className="text-muted-foreground text-sm">
              Bu örnek `viewOnly` modunda bir pozisyon gösterir. İnteraktif kullanımda `onCheckMove`,
              `onSuccessMovePlayed` ve `onNextMoveRequest` callback&apos;leri ile hamle akışını yönetebilirsin.
            </p>
            <CodeViewer
              code={`<VoltBoard
  sourceId="storybook-board"
  initialFen="r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3"
  size={520}
  viewOnly={true}
  drawHintMove="c4f7"
  onCheckMove={({ uci, fenBefore, playedBy }) => {
    // Return true for allowed move, false for wrong move.
    return uci === "c4f7";
  }}
  onSuccessMovePlayed={(move) => {
    console.log("success move:", move.uci);
  }}
  onNextMoveRequest={() => {
    // Optionally return opponent reply UCI.
    return "e8f7";
  }}
/>`}
            />
          </div>
        </div>
      </section>
    </StorybookPage>
  );
}
