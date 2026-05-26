import { AdminFormErrorAlert } from "@/app/(admin)/admin/shared/components/admin-form-error-alert";
import { getAllRiddles } from "@/features/riddle/services/riddle.service";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";
import { getAdminUser } from "@/lib/supabase/auth";

import { RiddlesList } from "./components/riddles-list";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminRiddlesPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const riddles = await getAllRiddles(supabase);
  const { error } = await searchParams;
  const errorMessage = getRiddleAdminErrorMessage(error);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl"></div>
        <div className="bg-muted/50 aspect-video rounded-xl"></div>
        <div className="bg-muted/50 aspect-video rounded-xl"></div>
      </div>
      <div className="min-h-[100vh] flex-1 md:min-h-min">
        <AdminFormErrorAlert message={errorMessage} />
        <RiddlesList riddles={riddles} />
      </div>
    </div>
  );
}
