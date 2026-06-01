import { Badge } from "@/components/ui/badge";
import { ThemeBadge } from "@/features/theme/components/theme-badge";
import type { ContentThemeWithTheme } from "@/features/content-theme/types/content-theme";
import { formatContentThemeWeightLabel } from "@/features/content-theme/types/content-theme-weight";

type ContentThemeListProps = {
  items: ContentThemeWithTheme[];
  showWeight?: boolean;
};

export function ContentThemeList({ items, showWeight = true }: ContentThemeListProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">No themes linked.</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-1.5">
          <ThemeBadge theme={item.theme} />
          {showWeight ? (
            <Badge variant="outline" className="font-mono text-xs" title={formatContentThemeWeightLabel(item.weight)}>
              {item.weight}
            </Badge>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
