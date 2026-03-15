import { Card, CardContent } from "@/components/ui/card";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import {
  getCorrectlySolvedVariantIds,
  getOpeningById,
  getOpeningVariantsByOpeningId,
} from "@/features/openings/services/openings";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
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
  const solvedVariantIds = await getCorrectlySolvedVariantIds(
    supabase,
    user.id,
    variantIds,
  );

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        <div>
          {variants.length === 0 ? (
            <Card className="border-border bg-card/50 border-dashed">
              <CardContent className="text-muted-foreground py-12 text-center">
                No variants in this opening yet. Coming soon!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    isComplete={solvedVariantIds.has(variant.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
