"use client";

import { useActionState, useState } from "react";

import {
  type UpdateContentThemeFormState,
  updateContentThemeAction,
} from "@/app/(admin)/admin/content-themes/actions/content-themes";
import { ContentThemeWeightSelect } from "@/features/content-theme/components/content-theme-weight-select";
import type { ContentThemeWithTheme } from "@/features/content-theme/types/content-theme";
import { formatContentTypeLabel } from "@/features/content-theme/types/content-type";
import type { ContentThemeWeight } from "@/features/content-theme/types/content-theme-weight";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

type Props = {
  item: ContentThemeWithTheme;
};

const initialState: UpdateContentThemeFormState = { error: null };

export function ContentThemeEditForm({ item }: Props) {
  const [state, formAction, isPending] = useActionState(updateContentThemeAction, initialState);
  const [weight, setWeight] = useState<ContentThemeWeight>(item.weight);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="contentThemeId" value={item.id} />
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      <dl className="text-muted-foreground grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-foreground">Content</dt>
          <dd>
            {formatContentTypeLabel(item.contentType)} · <span className="font-mono">{item.contentId}</span>
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
        <ContentThemeWeightSelect value={weight} onChange={setWeight} />
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
