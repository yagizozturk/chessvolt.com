import { getAdminUser } from "@/lib/supabase/auth";
import { getAllGameRiddles } from "@/features/game-riddle/services/game-riddle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { GameRiddlesList } from "./game-riddles-list";

export default async function AdminGameRiddlesPage() {
  const { supabase } = await getAdminUser();
  const riddles = await getAllGameRiddles(supabase);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Game Riddles</h1>
          <p className="text-muted-foreground">
            {riddles.length} game riddle(s) listed
          </p>
        </div>
        <Button asChild>
          <Link
            href="/admin/game-riddles/new"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>List</CardTitle>
          <CardDescription>
            Click a row to go to the detail page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameRiddlesList riddles={riddles} />
        </CardContent>
      </Card>
    </div>
  );
}
