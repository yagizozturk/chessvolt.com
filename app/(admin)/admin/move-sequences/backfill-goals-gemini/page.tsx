import { BackfillGoalsGeminiForm } from "@/app/(admin)/admin/move-sequences/backfill-goals-gemini/backfill-goals-gemini-form";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function BackfillMoveSequenceGoalsGeminiPage() {
  await getAdminUser();

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backfill move-sequence goals (Gemini)</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Requires GEMINI_API_KEY in your server environment. Optionally set GEMINI_MODEL (default:
          gemini-2.0-flash).
        </p>
      </div>
      <BackfillGoalsGeminiForm />
    </div>
  );
}
