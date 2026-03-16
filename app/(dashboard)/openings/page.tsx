import { OpeningsList } from "@/features/openings/components/openings-list";
import { getOpeningsWithVariantCount } from "@/features/openings/services/openings";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function OpeningsPage() {
  const { supabase } = await getAuthenticatedUser();
  const openings = await getOpeningsWithVariantCount(supabase);

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10 pb-16">
      <OpeningsList openings={openings} />
    </div>
  );
}
