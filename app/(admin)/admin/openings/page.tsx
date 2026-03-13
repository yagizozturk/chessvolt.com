import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminUser } from "@/lib/supabase/auth";
import {
  getAllOpenings,
  getAllOpeningVariants,
} from "@/features/openings/services/openings";
import { ParentOpeningsList } from "./parent-openings-list";
import { OpeningsList } from "./openings-list";
import { OpeningForm } from "./opening-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminOpeningsPage() {
  const { supabase } = await getAdminUser();
  const [openings, variants] = await Promise.all([
    getAllOpenings(supabase),
    getAllOpeningVariants(supabase),
  ]);

  return (
    <div className="space-y-8">
      {/* Openings (parent) */}
      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Openings</h2>
            <p className="text-muted-foreground text-sm">
              {openings.length} opening(s) — parent of variants
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Add New Opening</CardTitle>
            <CardDescription>
              Create a new opening (e.g. Sicilian Defense). Variants are added
              separately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OpeningForm />
          </CardContent>
        </Card>
        <div className="mt-4">
          <ParentOpeningsList openings={openings} />
        </div>
      </section>

      {/* Opening Variants */}
      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Opening Variants
            </h2>
            <p className="text-muted-foreground text-sm">
              {variants.length} variant(s) listed
            </p>
          </div>
          <Link
            href="/admin/openings/new"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Variant
          </Link>
        </div>
        <OpeningsList variants={variants} />
      </section>
    </div>
  );
}
