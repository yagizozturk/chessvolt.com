import { getAdminUser } from "@/lib/supabase/auth";
import { getAllGames } from "@/lib/services/game";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { GamesList } from "./games-list";

export default async function AdminGamesPage() {
  const { supabase } = await getAdminUser();
  const games = await getAllGames(supabase);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Games</h1>
          <p className="text-muted-foreground">
            {games.length} oyun listeleniyor
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/games/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yeni Ekle
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste</CardTitle>
          <CardDescription>
            Satıra tıklayarak detay sayfasına gidebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GamesList games={games} />
        </CardContent>
      </Card>
    </div>
  );
}
