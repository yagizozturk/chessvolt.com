"use server";

import type {
  CreateOpeningInput,
  UpdateOpeningInput,
} from "@/features/openings/repository/opening.repository";
import {
  createOpening,
  deleteOpening,
  updateOpening,
} from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOpeningAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string) || null;
  const description = (formData.get("description") as string) || null;
  const displayFen = (formData.get("displayFen") as string) || null;

  if (!name) {
    redirect("/admin/openings?error=missing_fields");
  }

  const input: CreateOpeningInput = {
    name,
    slug: slug || null,
    description: description || null,
    displayFen: displayFen || null,
  };

  const opening = await createOpening(supabase, input);
  if (!opening) {
    redirect("/admin/openings?error=create_failed");
  }

  revalidatePath("/admin/openings");
  redirect("/admin/openings");
}

export async function updateOpeningAction(id: string, formData: FormData) {
  const { supabase } = await getAdminUser();

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string) || null;
  const description = (formData.get("description") as string) || null;
  const displayFen = (formData.get("displayFen") as string) || null;

  const input: UpdateOpeningInput = {};
  if (name !== undefined) input.name = name;
  if (slug !== undefined) input.slug = slug || null;
  if (description !== undefined) input.description = description;
  if (displayFen !== undefined) input.displayFen = displayFen || null;

  const opening = await updateOpening(supabase, id, input);
  if (!opening) {
    redirect(`/admin/openings?error=update_failed`);
  }

  revalidatePath("/admin/openings");
  redirect("/admin/openings");
}

export async function deleteOpeningAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteOpening(supabase, id);
  if (!ok) {
    redirect("/admin/openings?error=delete_failed");
  }

  revalidatePath("/admin/openings");
  redirect("/admin/openings");
}
