import { getAdminUser } from "@/lib/supabase/auth";
import { getGameById } from "@/lib/services/game";
import { notFound } from "next/navigation";
import { GameDetail } from "../game-detail";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminGameDetailPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;

  const game = await getGameById(supabase, id);
  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GameDetail game={game} />
    </div>
  );
}
