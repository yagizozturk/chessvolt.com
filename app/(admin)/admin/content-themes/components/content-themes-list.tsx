"use client";

import Link from "next/link";

import { deleteThemeLinkAction } from "@/app/(admin)/admin/content-themes/actions/content-themes";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminThemeLink } from "@/features/theme-link/types/admin-theme-link";
import { formatThemeLinkKindLabel } from "@/features/theme-link/types/theme-link-kind";

type Props = {
  items: AdminThemeLink[];
};

export function ContentThemesList({ items }: Props) {
  async function handleDelete(item: AdminThemeLink) {
    const label = `${formatThemeLinkKindLabel(item.kind)} · ${item.theme.title}`;
    if (!confirm(`Delete link "${label}"?`)) return;
    await deleteThemeLinkAction(item.kind, item.id);
  }

  if (items.length === 0) {
    return <EmptyDataMessage message="No content–theme links yet." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Content</th>
            <th className="px-4 py-3 font-medium">Theme</th>
            <th className="px-4 py-3 font-medium">Weight</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const label = `${formatThemeLinkKindLabel(item.kind)} · ${item.theme.title}`;
            return (
              <tr key={`${item.kind}-${item.id}`} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{formatThemeLinkKindLabel(item.kind)}</div>
                  <div className="text-muted-foreground font-mono text-xs">{item.parentId}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.theme.title}</div>
                  <div className="text-muted-foreground font-mono text-xs">/{item.theme.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="font-mono">
                    {item.weight}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/content-themes/edit/${item.kind}/${item.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
