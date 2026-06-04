"use client";

import Link from "next/link";

import { deleteThemeAction } from "@/app/(admin)/admin/themes/actions/themes";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/features/theme/types/theme";
import { formatThemeCategoryLabel } from "@/features/theme/types/theme-category";

type Props = {
  themes: Theme[];
};

export function ThemesList({ themes }: Props) {
  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteThemeAction(id);
  }

  if (themes.length === 0) {
    return <EmptyDataMessage message="No themes yet." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Sort</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {themes.map((theme) => (
            <tr key={theme.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <div className="font-medium">{theme.title}</div>
                <div className="text-muted-foreground font-mono text-xs">/{theme.slug}</div>
              </td>
              <td className="text-muted-foreground px-4 py-3">{formatThemeCategoryLabel(theme.category)}</td>
              <td className="text-muted-foreground px-4 py-3 font-mono">{theme.sortOrder}</td>
              <td className="px-4 py-3">
                <Badge variant={theme.isActive ? "default" : "secondary"}>
                  {theme.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/themes/edit/${theme.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(theme.id, theme.title)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
