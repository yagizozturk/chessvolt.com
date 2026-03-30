import { getOpeningVariantById } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";

import { VariantDetail } from "../variants/variant-detail";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminOpeningVariantPage({ params }: Params) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const variant = await getOpeningVariantById(supabase, id);

  if (!variant) {
    notFound();
  }

  return <VariantDetail variant={variant} />;
}
