import OpeningVariantControllerUpdated from "@/features/openings/components/opening-variant-controller-updated";

export default function StorybookUpdatedBoardPage() {
  const mockVariant = {
    id: "storybook-variant",
    openingId: "storybook-opening",
    sortKey: 1,
    group: "storybook",
    title: "Updated Board Storybook",
    description: "Storybook variant for updated board testing",
    ply: 6,
    moves: "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6",
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6",
    initialFen: "start",
    displayFen: null,
    goals: null,
    ideas: null,
    createdAt: new Date().toISOString(),
  };

  return (
    <OpeningVariantControllerUpdated
      variant={mockVariant}
      nextVariantId={null}
      parentOpeningUrl="/openings"
    />
  );
}
