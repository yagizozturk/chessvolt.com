"use client";

import Link from "next/link";

import { deleteContentThemeAction } from "@/app/(admin)/admin/content-themes/actions/content-themes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatContentTypeLabel } from "@/features/content-theme/types/content-type";
import type { ContentThemeWithTheme } from "@/features/content-theme/types/content-theme";

type Props = {
  items: ContentThemeWithTheme[];
};

export function ContentThemesList({ items }: Props) {
  async function handleDelete(id: string, label: string) {
    if (!confirm(`Delete link "${label}"?`)) return;
    await deleteContentThemeAction(id);
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">No content–theme links yet.</p>;
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
            const label = `${formatContentTypeLabel(item.contentType)} · ${item.theme.title}`;
            return (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{formatContentTypeLabel(item.contentType)}</div>
                  <div className="text-muted-foreground font-mono text-xs">{item.contentId}</div>
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
                    <Link href={`/admin/content-themes/edit/${item.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id, label)}
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
