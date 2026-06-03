import { CollectionContentThemeAddForm } from "@/app/(admin)/admin/collections/components/collection-content-theme-add-form";
import { CollectionContentThemesList } from "@/app/(admin)/admin/collections/components/collection-content-themes-list";
import type { ContentThemeWithTheme } from "@/features/content-theme/types/content-theme";
import type { Theme } from "@/features/theme/types/theme";

type Props = {
  collectionId: string;
  linkedThemes: ContentThemeWithTheme[];
  themes: Theme[];
};

export function CollectionContentThemesSection({ collectionId, linkedThemes, themes }: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Linked themes</h3>
        <p className="text-muted-foreground text-sm">
          Collection cards show the two highest-weight themes. Use weight 10 for primary themes and 2–5 for context.
        </p>
        <CollectionContentThemesList collectionId={collectionId} items={linkedThemes} />
      </div>
      <div className="space-y-3 border-t pt-8">
        <h3 className="text-sm font-medium">Add theme</h3>
        <CollectionContentThemeAddForm
          collectionId={collectionId}
          themes={themes}
          linkedThemes={linkedThemes}
        />
      </div>
    </div>
  );
}
