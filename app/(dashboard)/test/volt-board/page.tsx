import VoltBoard from "@/components/volt-board/volt-board";

export default function VoltBoardPage() {
  return (
    <div className="container mx-auto max-w-3xl p-8">
      <VoltBoard
        sourceId="test-board"
        moves="e2e4 e7e5 g1f3 b8c6"
        width={500}
        height={500}
      />
    </div>
  );
}