import Link from "next/link";
import { ChevronLeft, Target } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import {
  getOpeningById,
  getOpeningVariantsByOpeningId,
} from "@/features/openings/services/openings";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";

type Params = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function OpeningBySlugAndIdPage({ params }: Params) {
  const { slug, id } = await params;
  const { supabase } = await getAuthenticatedUser();

  const opening = await getOpeningById(supabase, id);
  if (!opening) {
    notFound();
  }

  const variants = await getOpeningVariantsByOpeningId(supabase, opening.id);

  return (
    <div className="container mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        <div>
          <Link
            href="/openings"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Openings
          </Link>
          <div className="mb-8 flex items-center justify-between gap-4 px-2 py-3"></div>

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
                    width={220}
                    height={220}
                    href={`/openings/variant/${variant.id}`}
                    displayFen={variant.fen}
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
