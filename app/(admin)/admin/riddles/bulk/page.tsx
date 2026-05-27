import { AdminFormErrorAlert } from "@/app/(admin)/admin/shared/components/admin-form-error-alert";
import { getRiddleAdminErrorMessage } from "@/lib/admin/form-error-messages";

import { RiddleBulkForm } from "./riddle-bulk-form";

type Props = {
  searchParams: Promise<{ error?: string; created?: string; errors?: string; errorDetails?: string }>;
};

export default async function AdminRiddleBulkPage({ searchParams }: Props) {
  const { error, created, errors, errorDetails } = await searchParams;
  const errorMessage = getRiddleAdminErrorMessage(error);
  let parsedErrorDetails: { index: number; message: string }[] = [];

  if (errorDetails) {
    try {
      const parsed = JSON.parse(errorDetails) as unknown;
      if (Array.isArray(parsed)) {
        parsedErrorDetails = parsed.filter(
          (item): item is { index: number; message: string } =>
            typeof item === "object" &&
            item !== null &&
            "index" in item &&
            "message" in item &&
            typeof (item as { index: unknown }).index === "number" &&
            typeof (item as { message: unknown }).message === "string",
        );
      }
    } catch {
      parsedErrorDetails = [];
    }
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      <AdminFormErrorAlert message={errorMessage} />
      {created ? (
        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
          Created {created} riddles.
        </p>
      ) : null}
      {errors ? (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700">
          {errors} rows failed. See row-level messages below.
        </p>
      ) : null}
      {parsedErrorDetails.length > 0 ? (
        <div className="bg-muted/50 space-y-1 rounded-md border p-3">
          {parsedErrorDetails.map((item) => (
            <p key={`${item.index}-${item.message}`} className="text-xs">
              Row {item.index + 1}: {item.message}
            </p>
          ))}
        </div>
      ) : null}
      <RiddleBulkForm />
    </div>
  );
}
