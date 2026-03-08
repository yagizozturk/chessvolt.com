import { getRepById } from "@/lib/services/reps";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";
import RepsController from "@/components/controller/reps-controller";

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
