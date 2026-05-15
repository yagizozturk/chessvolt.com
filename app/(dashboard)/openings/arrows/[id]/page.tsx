import { notFound } from "next/navigation";

import { ArrowsController } from "@/features/arrows/components/arrows-controller/arrows-controller";
import { getOpeningById } from "@/features/openings/services/openings.service";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function ArrowsPage({ params }: Params) {
  const { id } = await params;
  const { supabase } = await getPublicUser();
  const opening = await getOpeningById(supabase, id);

  if (!opening) {
    notFound();
  }

  const destinationPath =
    opening.slug && opening.id ? `/openings/${opening.slug}/${opening.id}` : "/openings";

  return (
    <ArrowsController
      openingId={id}
      arrowGroups={opening.arrows ?? []}
      destinationPath={destinationPath}
    />
  );
}
