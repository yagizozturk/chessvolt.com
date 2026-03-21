import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllOpenings } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";

import { OpeningForm } from "./opening-form";
import { ParentOpeningsList } from "./parent-openings-list";

export default async function AdminOpeningsPage() {
  const { supabase } = await getAdminUser();
  const openings = await getAllOpenings(supabase);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
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
          <p className="text-muted-foreground mb-3 text-sm">
            Open an opening to manage its variants.
          </p>
          <ParentOpeningsList openings={openings} />
        </div>
      </section>

      <section className="border-border flex flex-wrap items-center gap-4 rounded-lg border p-4">
        <p className="text-muted-foreground text-sm">
          Global variant tools (pick opening inside the form):
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/openings/bulk"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <Upload className="h-4 w-4" />
            Toplu Variant
          </Link>
          <Link
            href="/admin/openings/new"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            New Variant
          </Link>
        </div>
      </section>
    </div>
  );
}
