import { getAdminUser } from "@/lib/supabase/auth";
import { getRepById } from "@/features/reps/services/reps";
import { notFound } from "next/navigation";
import { RepDetail } from "../rep-detail";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminRepDetailPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;

  const rep = await getRepById(supabase, id);
  if (!rep) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RepDetail rep={rep} />
    </div>
  );
}
