import { getUserCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getUserPracticeOpeningVariantsForUserWithSequences } from "@/features/user-practice-opening-variant/services/user-practice-opening-variant.service";
import { UserPractices } from "@/features/user-practices/components/user-practices";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function UserPracticesPage() {
  const { user, supabase } = await getAuthenticatedUser();
  const [userPracticeCollections, userPracticeVariants] = await Promise.all([
    getUserCollectionsWithRiddleCountAndThemes(supabase, user.id),
    getUserPracticeOpeningVariantsForUserWithSequences(supabase, user.id),
  ]);

  // Example data of userPracticeCollections:
  // [
  //   {
  //     id: "col-111",
  //     title: "My Tactics List",
  //     slug: "my-tactics-list",
  //     description: "Positions I saved from Lichess puzzles",
  //     coverImageUrl: "/images/collections/default-cover.png",
  //     coverImageColor: "#1e3a5f",
  //     difficulty: 4,
  //     collectionType: "custom",
  //     sortOrder: 0,
  //     isActive: true,
  //     createdBy: "user-abc",
  //     createdAt: "2026-03-01T10:00:00.000Z",
  //     updatedAt: "2026-03-10T14:30:00.000Z",
  //     riddleCount: 12,
  //     themes: [
  //       {
  //         id: "ct-1",
  //         collectionId: "col-111",
  //         themeId: "theme-fork",
  //         weight: "primary",
  //         createdAt: "2026-03-01T10:00:00.000Z",
  //         theme: {
  //           id: "theme-fork",
  //           slug: "fork",
  //           title: "Fork",
  //           description: null,
  //           category: "tactic",
  //           sortOrder: 1,
  //           isActive: true,
  //           createdAt: "2025-01-01T00:00:00.000Z",
  //           updatedAt: "2025-01-01T00:00:00.000Z",
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     id: "col-222",
  //     title: "Endgame Drills",
  //     slug: "endgame-drills",
  //     description: "King and pawn endings",
  //     coverImageUrl: "",
  //     coverImageColor: "#2d5016",
  //     difficulty: 6,
  //     collectionType: "custom",
  //     sortOrder: 1,
  //     isActive: true,
  //     createdBy: "user-abc",
  //     createdAt: "2026-02-15T08:00:00.000Z",
  //     updatedAt: "2026-02-15T08:00:00.000Z",
  //     riddleCount: 5,
  //     themes: [],
  //   },
  // ]
  //
  // Example data of userPracticeVariants: Have sequence data as we show directly variants.
  // [
  //   {
  //     id: "upov-1",
  //     userId: "user-abc",
  //     openingVariantId: "ov-sicilian-dragon",
  //     isActive: true,
  //     sortOrder: 0,
  //     createdAt: "2026-03-05T12:00:00.000Z",
  //     openingVariant: {
  //       id: "ov-sicilian-dragon",
  //       openingId: "opening-sicilian",
  //       sortKey: 1,
  //       group: "Sicilian Defense",
  //       title: "Dragon Variation",
  //       description: "Classic Yugoslav Attack setup",
  //       initialPly: 12,
  //       createdAt: "2025-06-01T00:00:00.000Z",
  //       moveSequence: {
  //         id: "seq-aaa-111",
  //         initialFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  //         moves: "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6",
  //         goals: null,
  //         pgn: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6",
  //         displayFen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
  //         createdAt: "2025-06-01T00:00:00.000Z",
  //         updatedAt: "2025-06-01T00:00:00.000Z",
  //       },
  //     },
  //   },
  // ]

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <UserPractices
        userCollections={userPracticeCollections}
        userPracticeVariants={userPracticeVariants}
        userId={user.id}
        supabase={supabase}
      />
    </div>
  );
}
