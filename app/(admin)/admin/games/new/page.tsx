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
import { ArrowLeft, Upload } from "lucide-react";
import { GameForm } from "../game-form";

export default async function AdminGameNewPage() {
  await getAdminUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/games" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/games/import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Toplu PGN İçe Aktar
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Game</CardTitle>
          <CardDescription>
            Tek oyun ekleyin. Toplu eklemek için{" "}
            <Link
              href="/admin/games/import"
              className="text-primary underline hover:no-underline"
            >
              PGN İçe Aktar
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameForm />
        </CardContent>
      </Card>
    </div>
  );
}
