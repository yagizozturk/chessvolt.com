import { getOpeningVariantById } from "@/features/openings/services/openings";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";
import OpeningsController from "@/features/openings/components/openings-controller";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function OpeningVariantPage({ params }: Params) {
  const { supabase } = await getAuthenticatedUser();
  const { id } = await params;
  const variant = await getOpeningVariantById(supabase, id);

  if (!variant) {
    notFound();
  }

  return <OpeningsController variant={variant} />;
}
