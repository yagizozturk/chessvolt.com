import Image from "next/image";
import Link from "next/link";

import { buildThemePlayUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import type { Theme } from "@/features/theme/types/theme";
import { THEME_CATEGORIES, formatThemeCategoryLabel } from "@/features/theme/types/theme-category";
import { groupThemesByCategory } from "@/features/theme/utilities/group-themes-by-category";
import { getThemeCoverImageSrc } from "@/features/theme/utilities/theme-cover-image.utils";

type ThemeListProps = {
  themes: Theme[];
  groupByCategory?: boolean;
};

export function ThemeList({ themes, groupByCategory = true }: ThemeListProps) {
  if (themes.length === 0) {
    return <p className="text-muted-foreground text-sm">No themes to show.</p>;
  }

  if (!groupByCategory) {
    return (
      <ul className="flex flex-wrap gap-4">
        {themes.map((theme) => (
          <ThemeListItem key={theme.id} theme={theme} />
        ))}
      </ul>
    );
  }

  const grouped = groupThemesByCategory(themes);

  return (
    <div className="space-y-8">
      {THEME_CATEGORIES.map((category) => {
        const items = grouped.get(category) ?? [];
        if (items.length === 0) return null;

        return (
          <section key={category}>
            <h3 className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
              {formatThemeCategoryLabel(category)}
            </h3>
            <ul className="flex flex-wrap gap-4">
              {items.map((theme) => (
                <ThemeListItem key={theme.id} theme={theme} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// ================================================================================
// Theme list item component. This link redirect to /puzzle/[id]
// ================================================================================
function ThemeListItem({ theme }: { theme: Theme }) {
  const imageSrc = theme.coverImageUrl ? getThemeCoverImageSrc(theme.coverImageUrl) : null;

  return (
    <li>
      <Link
        href={buildThemePlayUrl(theme.slug)}
        className="group flex w-28 flex-col items-center gap-2 transition-opacity hover:opacity-90"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={theme.title}
            width={112}
            height={112}
            className="ring-muted/70 hover:ring-primary size-28 rounded-xl object-contain ring-4 transition-all"
          />
        ) : null}
        <span className="text-center text-sm font-medium">{theme.title}</span>
      </Link>
    </li>
  );
}
