import { NumberStatsCard } from "@/components/stats/number-stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import {
  getCorrectlySolvedVariantIds,
  getOpeningById,
  getOpeningVariantsByOpeningId,
  getOpeningVariantAttemptsForVariants,
} from "@/features/openings/services/openings";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { Target, TrendingUp, Trophy, XOctagon } from "lucide-react";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function OpeningBySlugAndIdPage({ params }: Params) {
  const { slug, id } = await params;
  const { user, supabase } = await getAuthenticatedUser();

  const opening = await getOpeningById(supabase, id);
  if (!opening) {
    notFound();
  }

  const variants = await getOpeningVariantsByOpeningId(supabase, opening.id);
  const variantIds = variants.map((v) => v.id);
  const [solvedVariantIds, attempts] = await Promise.all([
    getCorrectlySolvedVariantIds(supabase, user.id, variantIds),
    getOpeningVariantAttemptsForVariants(supabase, user.id, variantIds),
  ]);

  const total = variants.length;
  const correct = attempts.filter((a) => a.isCorrect).length;
  const attempted = attempts.length;
  const incorrect = attempted - correct;
  const remaining = total - attempted;
  const solveRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        <div>
          {variants.length === 0 ? (
            <Card className="border-border bg-card/50 border-dashed">
              <CardContent className="text-muted-foreground py-12 text-center">
                No variants in this opening yet. Coming soon!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 px-2 sm:grid-cols-2 lg:grid-cols-3">
              {variants.map((variant, index) => {
                const num = index + 1;

                return (
                  <OpeningBoardCard
                    key={variant.id}
                    id={variant.id}
                    name={variant.title ?? ""}
                    num={num}
                    width={250}
                    height={250}
                    href={`/openings/variant/${variant.id}`}
                    fen={variant.displayFen ?? variant.initialFen ?? ""}
                    isComplete={
                      solvedVariantIds.has(variant.id) ? true : undefined
                    }
                    description={variant.description}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-primary h-5 w-5" />
                Progress
              </CardTitle>
              <CardDescription>Your opening stats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-border bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-muted-foreground text-sm">
                  Total Solved
                </span>
                <span className="text-foreground font-bold">{total}</span>
              </div>
              <div className="border-border bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-muted-foreground text-sm">
                  Remaining Variants
                </span>
                <span className="text-foreground font-bold">{remaining}</span>
              </div>
            </CardContent>
          </Card>

          <NumberStatsCard
            icon={Trophy}
            label="Correct answers"
            value={correct}
            variant="primary"
          />
          <NumberStatsCard
            icon={XOctagon}
            label="Incorrect attempts"
            value={incorrect}
            variant="destructive"
          />
          <NumberStatsCard
            icon={TrendingUp}
            label="Success percentage"
            value={`${solveRate}%`}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}
