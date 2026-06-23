import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteRiddleButton } from "@/app/(admin)/admin/riddles/components/delete-riddle-button";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCollectionRiddlesByRiddleId } from "@/features/collection-riddles/services/collection-riddles.service";
import { getAllCollections } from "@/features/collection/services/collection.service";
import { getGameById } from "@/features/game/services/game.service";
import { getRiddleByIdWithThemes } from "@/features/riddle/services/riddle.service";
import { formatRiddleRatingLabel } from "@/features/riddle/types/riddle-rating";
import { getAdminUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminRiddleDetailPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await getAdminUser();
  const riddle = await getRiddleByIdWithThemes(supabase, id);

  if (!riddle) {
    notFound();
  }

  const [game, collectionLinks, collections] = await Promise.all([
    riddle.gameId ? getGameById(supabase, riddle.gameId) : null,
    getCollectionRiddlesByRiddleId(supabase, id),
    getAllCollections(supabase),
  ]);

  const collection = collectionLinks[0]
    ? collections.find((c) => c.id === collectionLinks[0]!.collectionId)
    : null;

  const displayFen = riddle.moveSequence.displayFen ?? riddle.moveSequence.initialFen;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/riddles" className="text-muted-foreground hover:text-foreground text-sm">
            ← Back to riddles
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{riddle.title}</h1>
          <p className="text-muted-foreground text-sm">
            {formatRiddleRatingLabel(riddle.rating)}
            {riddle.source ? ` · ${riddle.source}` : ""}
            {riddle.sourceId ? ` · ${riddle.sourceId}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/riddles/edit/${riddle.id}`}>Edit</Link>
          </Button>
          <DeleteRiddleButton id={riddle.id} title={riddle.title} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Display position</CardTitle>
          </CardHeader>
          <CardContent>
            <DisplayBoard sourceId={`riddle-detail-${riddle.id}`} initialFen={displayFen} size={360} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Status:</span>{" "}
              <Badge variant={riddle.isActive ? "default" : "secondary"}>
                {riddle.isActive ? "Active" : "Inactive"}
              </Badge>
            </p>
            {riddle.description ? (
              <p>
                <span className="text-muted-foreground">Description:</span> {riddle.description}
              </p>
            ) : null}
            {collection ? (
              <p>
                <span className="text-muted-foreground">Collection:</span> {collection.title}
              </p>
            ) : null}
            {game ? (
              <p>
                <span className="text-muted-foreground">Game:</span> {game.whitePlayer} vs {game.blackPlayer}
              </p>
            ) : null}
            <div>
              <p className="text-muted-foreground mb-1">Themes</p>
              <div className="flex flex-wrap gap-1">
                {riddle.themeSlugs.map((slug) => (
                  <Badge key={slug} variant="outline">
                    {slug}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Moves (UCI)</p>
              <p className="font-mono text-xs break-all">{riddle.moveSequence.moves}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Initial FEN</p>
              <p className="font-mono text-xs break-all">{riddle.moveSequence.initialFen}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
