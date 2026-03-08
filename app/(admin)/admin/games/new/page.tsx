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
            Listeye Dön
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Oyun</CardTitle>
          <CardDescription>Yeni bir oyun ekleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <GameForm />
        </CardContent>
      </Card>
    </div>
  );
}
