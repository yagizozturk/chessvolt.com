import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminUser } from "@/lib/supabase/auth";

import { PgnGoalsPreview } from "./pgn-goals-preview";

export default async function PgnGoalsPreviewPage() {
  await getAdminUser();

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <Link
        href="/admin/openings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to openings
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>PGN Goals Preview</CardTitle>
          <CardDescription>
            Paste a Lichess study PGN to convert comments and visuals into a goals array. Preview only — no database
            writes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PgnGoalsPreview />
        </CardContent>
      </Card>
    </div>
  );
}
