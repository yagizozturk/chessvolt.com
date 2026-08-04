"use client";

import { useState } from "react";

import {
  deleteStudyContentThemeAction,
  updateStudyContentThemeAction,
} from "@/app/(admin)/admin/studies/actions/study-content-themes";
import type { StudyThemeWithTheme } from "@/features/study-theme/types/study-theme";
import {
  formatThemeLinkWeightLabel,
  isThemeLinkWeight,
  THEME_LINK_WEIGHTS,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type Props = {
  studyId: string;
  items: StudyThemeWithTheme[];
};

export function StudyContentThemesList({ studyId, items }: Props) {
  if (items.length === 0) {
    return <EmptyDataMessage message="No themes linked to this study yet." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Theme</th>
            <th className="px-4 py-3 font-medium">Weight</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <StudyContentThemeRow
              key={item.id}
              studyId={studyId}
              item={item}
              showTopTwoHint={index < 2}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type RowProps = {
  studyId: string;
  item: StudyThemeWithTheme;
  showTopTwoHint: boolean;
};

function StudyContentThemeRow({ studyId, item, showTopTwoHint }: RowProps) {
  const [weight, setWeight] = useState<ThemeLinkWeight>(item.weight);

  async function handleDelete() {
    const label = item.theme.title;
    if (!confirm(`Remove "${label}" from this study?`)) return;
    await deleteStudyContentThemeAction(item.id, studyId);
  }

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <div className="font-medium">{item.theme.title}</div>
            <div className="text-muted-foreground font-mono text-xs">/{item.theme.slug}</div>
          </div>
          {showTopTwoHint ? (
            <Badge variant="secondary" className="text-xs">
              Shown on card
            </Badge>
          ) : null}
        </div>
      </td>
      <td className="px-4 py-3">
        <form action={updateStudyContentThemeAction} className="flex items-center gap-2">
          <input type="hidden" name="studyId" value={studyId} />
          <input type="hidden" name="studyThemeId" value={item.id} />
          <select
            name="weight"
            required
            value={String(weight)}
            onChange={(e) => {
              const num = Number(e.target.value);
              if (isThemeLinkWeight(num)) setWeight(num);
            }}
            title={formatThemeLinkWeightLabel(weight)}
            className={cn(
              "border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 min-w-[4.5rem] rounded-md border border-2 bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
            )}
          >
            {THEME_LINK_WEIGHTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm" className="shrink-0">
            Save
          </Button>
        </form>
      </td>
      <td className="px-4 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Remove
        </Button>
      </td>
    </tr>
  );
}
