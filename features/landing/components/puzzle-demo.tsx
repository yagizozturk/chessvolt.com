import { LandingPuzzleController } from "@/features/landing/components/puzzle-controller";
import { getPuzzleById } from "@/features/puzzle/services/puzzle.service";
import { createClient } from "@/lib/supabase/server";

const DEMO_PUZZLE_ID = "dbd4158d-6313-4929-b4b5-d77c378b5c2d";

export async function PuzzleDemo() {
  const supabase = await createClient();
  const puzzle = await getPuzzleById(supabase, DEMO_PUZZLE_ID);
  if (!puzzle || !puzzle.isActive) return null;

  return (
    <section aria-label="Try a puzzle" className="bg-white py-20">
      <header className="relative z-10 mx-auto max-w-xl text-center">
        <p className="text-muted mb-4 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-xs">
          <span aria-hidden="true" className="bg-primary h-1.5 w-1.5 rounded-full" />
          TRY IT ON THE BOARD
        </p>
        <h2 className="text-secondary text-[42px] leading-[1.08] font-semibold tracking-[-0.045em] sm:text-[64px] lg:text-[72px]">
          Can you find the best move?
        </h2>
        <p className="text-muted mx-auto mt-5 mb-0 max-w-[690px] text-sm leading-7 sm:max-w-[730px] sm:text-base">
          Put your chess skills to the test with this interactive puzzle. Play your move on the board and work through
          the position. This is how practice feels on ChessVolt. You can also revisit mistakes from your own games and
          try to find the moves you missed.
        </p>
      </header>
      <div className="container mx-auto mt-4 max-w-5xl px-4 md:px-6">
        <LandingPuzzleController puzzle={puzzle} />
      </div>
    </section>
  );
}
