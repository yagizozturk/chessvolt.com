"use client";

import { useActionState, useState } from "react";

import {
  type UpdateThemeLinkFormState,
  updateThemeLinkAction,
} from "@/app/(admin)/admin/content-themes/actions/content-themes";
import { ThemeLinkWeightSelect } from "@/features/theme-link/components/theme-link-weight-select";
import type { AdminThemeLink } from "@/features/theme-link/types/admin-theme-link";
import { formatThemeLinkKindLabel } from "@/features/theme-link/types/theme-link-kind";
import type { ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

type Props = {
  item: AdminThemeLink;
};

const initialState: UpdateThemeLinkFormState = { error: null };

export function ContentThemeEditForm({ item }: Props) {
  const [state, formAction, isPending] = useActionState(updateThemeLinkAction, initialState);
  const [weight, setWeight] = useState<ThemeLinkWeight>(item.weight);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="kind" value={item.kind} />
      <input type="hidden" name="themeLinkId" value={item.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <dl className="text-muted-foreground grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-foreground">Content</dt>
          <dd>
            {formatThemeLinkKindLabel(item.kind)} · <span className="font-mono">{item.parentId}</span>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Theme</dt>
          <dd>
            {item.theme.title} · <span className="font-mono">/{item.theme.slug}</span>
          </dd>
        </div>
      </dl>
      <FieldGroup>
        <ThemeLinkWeightSelect value={weight} onChange={setWeight} />
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
