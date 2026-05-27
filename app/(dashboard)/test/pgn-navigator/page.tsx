import VoltBoardNavigator from "@/components/board-navigator/volt-board-navigator";

type Props = {
  searchParams: Promise<{ pgn?: string }>;
};

export default async function PgnNavigatorPage({ searchParams }: Props) {
  const { pgn = "" } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <VoltBoardNavigator pgn={pgn} sourceId="pgn-navigator-volt" />
    </div>
  );
}
