import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function MyCollectionsPage() {
  await getAuthenticatedUser();

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <div className="mt-12 rounded-xl border p-6">
        <h1 className="text-2xl font-bold tracking-tight">My Collections</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Your saved and created collections will appear here.
        </p>
      </div>
    </div>
  );
}
