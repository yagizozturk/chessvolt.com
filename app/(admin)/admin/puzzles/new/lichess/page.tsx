import Link from "next/link";

import { LichessImportForm } from "@/app/(admin)/admin/puzzles/components/lichess-import-form";

export default function NewLichessPuzzlePage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link href="/admin/puzzles" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to puzzles
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Import puzzles — Lichess CSV</h1>
      </div>
      <LichessImportForm />
    </div>
  );
}
