import Link from "next/link";

import { LichessImportForm } from "@/app/(admin)/admin/riddles/components/lichess-import-form";

export default function NewLichessRiddlePage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link href="/admin/riddles" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to riddles
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Import riddles — Lichess CSV</h1>
      </div>
      <LichessImportForm />
    </div>
  );
}
