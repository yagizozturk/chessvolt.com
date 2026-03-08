import { getAdminUser } from "@/lib/supabase/auth";
import * as gameRepo from "@/lib/repositories/game.repository";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { GameRiddleForm } from "../game-riddle-form";

export default async function AdminGameRiddleNewPage() {
  const { supabase } = await getAdminUser();
  const games = await gameRepo.findAll(supabase);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/admin/game-riddles"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Game Riddle</CardTitle>
          <CardDescription>
            Add a new game riddle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameRiddleForm games={games} />
        </CardContent>
      </Card>
    </div>
  );
}
