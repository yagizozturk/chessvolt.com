import { getRepById } from "@/features/reps/services/reps";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";
import RepsController from "@/features/reps/components/reps-controller";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function RepDetailPage({ params }: Params) {
  const { supabase } = await getAuthenticatedUser();
  const { id } = await params;
  const rep = await getRepById(supabase, id);

  if (!rep) {
    notFound();
  }

  return <RepsController rep={rep} />;
}
