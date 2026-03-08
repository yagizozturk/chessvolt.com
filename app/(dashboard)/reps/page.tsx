import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getAllReps } from "@/lib/services/reps";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import type { Rep } from "@/lib/model/reps";

function RepsList({ reps }: { reps: Rep[] }) {
  if (reps.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Henüz repertoire yok.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {reps.map((r) => (
        <Link
          key={r.id}
          href={`/reps/${r.id}`}
          className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <span className="font-medium">{r.title || "İsimsiz Repertoire"}</span>
            {r.openingTags && r.openingTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {r.openingTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-muted px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {r.openingTags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{r.openingTags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      ))}
    </div>
  );
}

export default async function RepsPage() {
  const { supabase } = await getAuthenticatedUser();
  const reps = await getAllReps(supabase);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Repertoire</h1>
        <p className="text-muted-foreground">
          {reps.length} repertoire listeleniyor
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste</CardTitle>
          <CardDescription>
            Satıra tıklayarak detay sayfasına gidebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RepsList reps={reps} />
        </CardContent>
      </Card>
    </div>
  );
}
