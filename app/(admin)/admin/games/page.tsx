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
import { Plus, Upload } from "lucide-react";
import { GamesList } from "./games-list";

type SearchParams = {
  searchParams: Promise<{ imported?: string; errors?: string }>;
};

export default async function AdminGamesPage({ searchParams }: SearchParams) {
  const { supabase } = await getAdminUser();
  const games = await getAllGames(supabase);
  const { imported, errors } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      {imported && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-600 dark:text-green-400">
          {imported} oyun başarıyla import edildi.
          {errors && ` (${errors} hata)`}
        </div>
      )}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Games</h1>
          <p className="text-muted-foreground">
            {games.length} oyun listeleniyor
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link
              href="/admin/games/import"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import PGN
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/games/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni Ekle
            </Link>
          </Button>
        </div>
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
