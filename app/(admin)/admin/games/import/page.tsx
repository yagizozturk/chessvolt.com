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
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { ImportPgnForm } from "./import-pgn-form";

type SearchParams = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminGamesImportPage({ searchParams }: SearchParams) {
  await getAdminUser();
  const { error } = await searchParams;

  const errorMessages: Record<string, string> = {
    missing_pgn: "PGN metni boş.",
    invalid_pgn: "Geçerli PGN bulunamadı.",
    none_added: "Hiçbir oyun eklenemedi.",
  };

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
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Toplu PGN İçe Aktar
          </CardTitle>
          <CardDescription>
            Paste toplu PGN metnini veya dosya yükleyin. Oyunlar boş satırlarla
            ayrılmış olmalı. Birden fazla oyun varsa hepsi tek seferde eklenir.
          </CardDescription>
          {error && (
            <p className="text-sm text-destructive">
              {errorMessages[error] ?? error}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <ImportPgnForm />
        </CardContent>
      </Card>
    </div>
  );
}
