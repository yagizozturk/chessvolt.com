import { AdminFormErrorAlert } from "@/app/(admin)/admin/shared/components/admin-form-error-alert";
import { getAllCollections } from "@/features/collection/services/collection.service";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";
import { getAdminUser } from "@/lib/supabase/auth";

import { RiddleNewForm } from "./riddle-new-form";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminRiddleNewPgnToFenPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const collections = await getAllCollections(supabase);
  const { error } = await searchParams;
  const errorMessage = getRiddleAdminErrorMessage(error);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      <AdminFormErrorAlert message={errorMessage} />
      <RiddleNewForm collections={collections} />
    </div>
  );
}
