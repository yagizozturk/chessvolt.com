import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ImportVariantsForm } from "./import-variants-form";

type Props = {
  searchParams: Promise<{
    error?: string;
    created?: string;
    errors?: string;
    errorDetails?: string;
  }>;
};

type BulkImportError = {
  index: number;
  message: string;
};

export default async function AdminOpeningsBulkPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const openings = await getAllOpenings(supabase);
  const params = await searchParams;
  let parsedErrors: BulkImportError[] = [];

  if (params.errorDetails) {
    try {
      const parsed = JSON.parse(params.errorDetails) as unknown;
      if (Array.isArray(parsed)) {
        parsedErrors = parsed.filter(
          (item): item is BulkImportError =>
            typeof item === "object" &&
            item !== null &&
            "index" in item &&
            "message" in item &&
            typeof item.index === "number" &&
            typeof item.message === "string",
        );
      }
    } catch {
      parsedErrors = [];
    }
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/admin/openings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </Link>
      {params.error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive mb-4 rounded-md border p-3 text-sm">
          {params.error === "invalid_json" && "Geçersiz JSON formatı."}
        </div>
      )}
      {params.created && (
        <div className="mb-4 rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
          {params.created} variant oluşturuldu.
        </div>
      )}
      {params.errors && Number(params.errors) > 0 && (
        <div className="mb-4 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <p>{params.errors} hata alındı.</p>
          {parsedErrors.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {parsedErrors.map((error) => (
                <li key={`${error.index}-${error.message}`}>
                  Satır {error.index + 1}: {error.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2">Detay alınamadı.</p>
          )}
        </div>
      )}
      {openings.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center">
          Önce bir opening oluşturmanız gerekiyor.
        </p>
      ) : (
        <ImportVariantsForm />
      )}
    </div>
  );
}
