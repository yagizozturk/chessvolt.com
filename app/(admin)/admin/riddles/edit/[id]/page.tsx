import Link from "next/link";
import { notFound } from "next/navigation";

import { RiddleEditForm } from "@/app/(admin)/admin/riddles/components/riddle-edit-form";
import { resolveRiddleEditInitialPgn } from "@/app/(admin)/admin/riddles/lib/resolve-riddle-edit-pgn";
import { getStudyRiddlesByRiddleId } from "@/features/study-riddles/services/study-riddles.service";
import { getAllStudies } from "@/features/study/services/study.service";
import { getGameById } from "@/features/game/services/game.service";
import { getRiddleByIdWithThemes } from "@/features/riddle/services/riddle.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminRiddleEditPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await getAdminUser();
  const riddle = await getRiddleByIdWithThemes(supabase, id);

  if (!riddle) {
    notFound();
  }

  const [studies, studyLinks, game] = await Promise.all([
    getAllStudies(supabase),
    getStudyRiddlesByRiddleId(supabase, id),
    riddle.gameId ? getGameById(supabase, riddle.gameId) : null,
  ]);

  const initialPgn = resolveRiddleEditInitialPgn(riddle.moveSequence, game?.pgn);
  const studyId = studyLinks[0]?.studyId ?? "";

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <Link href={`/admin/riddles/${id}`} className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to riddle
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Edit riddle</h1>
      </div>
      <RiddleEditForm
        riddle={riddle}
        studies={studies}
        studyId={studyId}
        initialPgn={initialPgn}
      />
    </div>
  );
}
