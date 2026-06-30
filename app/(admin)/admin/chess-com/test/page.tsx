import { ChessComTestForm } from "@/app/(admin)/admin/chess-com/test/chess-com-test-form";
import { getAdminUser } from "@/lib/supabase/auth";

export default async function ChessComTestPage() {
  await getAdminUser();

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chess.com PubAPI test</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Exercise archive listing, monthly game JSON, and monthly PGN endpoints.
        </p>
      </div>
      <ChessComTestForm />
    </div>
  );
}
