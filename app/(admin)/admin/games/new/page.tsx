import { getAdminUser } from "@/lib/supabase/auth";
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
import { GameForm } from "../game-form";

export default async function AdminGameNewPage() {
  await getAdminUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/games" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
<CardTitle>New Game</CardTitle>
        <CardDescription>Add a new game</CardDescription>
        </CardHeader>
        <CardContent>
          <GameForm />
        </CardContent>
      </Card>
    </div>
  );
}
