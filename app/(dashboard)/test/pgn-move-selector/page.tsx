import VoltBoard from "@/components/volt-board/volt-board";

export default function PgnMoveSelectorPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-4 p-8">
      <VoltBoard
        sourceId="pgn-move-selector"
        mode="opening"
        moves=""
        width={500}
        height={500}
        viewOnly
      />
      <textarea
        className="border-input h-40 w-full rounded-md border bg-transparent p-2 font-mono text-sm"
        placeholder="PGN"
        spellCheck={false}
      />
    </div>
  );
}
