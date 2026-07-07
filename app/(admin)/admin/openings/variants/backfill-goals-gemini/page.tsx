import { BackfillOpeningGoalsGeminiForm } from "@/app/(admin)/admin/openings/variants/backfill-goals-gemini/backfill-goals-gemini-form";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function BackfillOpeningGoalsGeminiPage() {
  await getAdminUser();

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backfill opening variant goals (Gemini)</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Requires GEMINI_API_KEY in your server environment. Optionally set GEMINI_MODEL (default:
          gemini-2.0-flash).
        </p>
      </div>
      <BackfillOpeningGoalsGeminiForm />
    </div>
  );
}
