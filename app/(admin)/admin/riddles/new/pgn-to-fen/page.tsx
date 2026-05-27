import { AdminFormErrorAlert } from "@/app/(admin)/admin/shared/components/admin-form-error-alert";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";

import { RiddlePgnToFenLayout } from "./riddle-pgn-to-fen-layout";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminRiddleNewPgnToFenPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorMessage = getRiddleAdminErrorMessage(error);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      <AdminFormErrorAlert message={errorMessage} />
      <RiddlePgnToFenLayout />
    </div>
  );
}
