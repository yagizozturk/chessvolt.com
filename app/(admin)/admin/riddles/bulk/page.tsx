import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminUser } from "@/lib/supabase/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ImportRiddlesForm } from "./import-riddles-form";

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

export default async function AdminRiddlesBulkPage({ searchParams }: Props) {
  await getAdminUser();
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
        href="/admin/riddles"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to riddles
      </Link>

      {params.error === "invalid_json" && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
          Invalid JSON format.
        </div>
      )}

      {params.created && (
        <div className="rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
          {params.created} riddle(s) created.
        </div>
      )}

      {params.errors && Number(params.errors) > 0 && (
        <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <p>{params.errors} error(s).</p>
          {parsedErrors.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {parsedErrors.map((err) => (
                <li key={`${err.index}-${err.message}`}>
                  Row {err.index + 1}: {err.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2">Could not load error details.</p>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Bulk import riddles</CardTitle>
          <CardDescription>
            Paste JSON for one or many riddles. Each item creates a move sequence and riddle row
            (with or without <code className="text-xs">game_id</code>).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImportRiddlesForm />
        </CardContent>
      </Card>
    </div>
  );
}
