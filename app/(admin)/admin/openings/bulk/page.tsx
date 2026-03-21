import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

import { BulkVariantForm } from "../bulk-variant-form";

type Props = {
  searchParams: Promise<{
    error?: string;
    created?: string;
    errors?: string;
    errorDetails?: string;
  }>;
};

export default async function AdminOpeningsBulkPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const openings = await getAllOpenings(supabase);
  const params = await searchParams;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/openings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Toplu Variant Gir
          </CardTitle>
          <CardDescription>
            JSON formatında variant verisi yapıştırın. Tek obje veya obje dizisi
            desteklenir. display_fen ve moves otomatik hesaplanır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 mb-4 rounded-md border p-4 font-mono text-xs">
            <p className="mb-2 font-semibold">Örnek format:</p>
            <pre className="overflow-x-auto whitespace-pre-wrap">
              {`{
  "opening_id": "uuid",
  "sort_key": 201,
  "title": "c5 Line: Queen Check Defense",
  "pgn": "1.d4 d5 2.Nc3 Nf6 3.Bf4 c5 ...",
  "initial_fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "initial_ply": 0,
  "display_ply": 4,
  "description": "Optional description"
}`}
            </pre>
          </div>
          {params.error && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive mb-4 rounded-md border p-3 text-sm">
              {params.error === "gecersiz_json" && "Geçersiz JSON formatı."}
            </div>
          )}
          {params.created && (
            <div className="mb-4 rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
              {params.created} variant oluşturuldu.
            </div>
          )}
          {params.errors && Number(params.errors) > 0 && (
            <div className="mb-4 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
              {params.errors} hata. Detay: {params.errorDetails ?? "bilinmiyor"}
            </div>
          )}
          {openings.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              Önce bir opening oluşturmanız gerekiyor.
            </p>
          ) : (
            <BulkVariantForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
