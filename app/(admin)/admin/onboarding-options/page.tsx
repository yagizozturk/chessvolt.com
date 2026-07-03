import { Plus } from "lucide-react";
import Link from "next/link";

import { OnboardingOptionsList } from "@/app/(admin)/admin/onboarding-options/components/onboarding-options-list";
import { getAllOnboardingOptionsWithQuestion } from "@/features/onboarding-option/services/onboarding-option.service";
import { getAdminUser } from "@/lib/supabase/auth";

const ONBOARDING_OPTION_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Please fill in all required fields.",
  invalid_rating: "Initial rating must be 100–3000.",
  create_failed: "Could not create the option. Check that value is unique for this question.",
  delete_failed: "Could not delete the option. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminOnboardingOptionsPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const options = await getAllOnboardingOptionsWithQuestion(supabase);
  const { error } = await searchParams;
  const errorMessage = error ? (ONBOARDING_OPTION_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Onboarding options</h2>
            <p className="text-muted-foreground text-sm">{options.length} options</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/onboarding-options/create"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              New option
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <OnboardingOptionsList options={options} />
        </div>
      </section>
    </div>
  );
}
