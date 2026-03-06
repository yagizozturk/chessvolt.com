import { getPuzzleById } from "@/lib/services/puzzle";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";
import PuzzleController from "@/components/controller/puzzle-controller";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function PuzzleDetailPage({ params }: Params) {
  const { supabase } = await getAuthenticatedUser();
  const { id } = await params;
  const puzzle = await getPuzzleById(supabase, id);

  if (!puzzle) {
    notFound();
  }

  return <PuzzleController puzzle={puzzle} />;
}
