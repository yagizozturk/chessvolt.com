import { BackfillGoalsForm } from "@/app/(admin)/admin/move-sequences/backfill-goals/backfill-goals-form";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function BackfillMoveSequenceGoalsPage() {
  await getAdminUser();

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backfill move-sequence goals</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Requires OLLAMA_BASE_URL and OLLAMA_MODEL in your server environment.
        </p>
      </div>
      <BackfillGoalsForm />
    </div>
  );
}
