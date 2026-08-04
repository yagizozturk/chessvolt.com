import { StudyContentThemeAddForm } from "@/app/(admin)/admin/studies/components/study-content-theme-add-form";
import { StudyContentThemesList } from "@/app/(admin)/admin/studies/components/study-content-themes-list";
import type { StudyThemeWithTheme } from "@/features/study-theme/types/study-theme";
import type { Theme } from "@/features/theme/types/theme";

type Props = {
  studyId: string;
  linkedThemes: StudyThemeWithTheme[];
  themes: Theme[];
};

export function StudyContentThemesSection({ studyId, linkedThemes, themes }: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Linked themes</h3>
        <p className="text-muted-foreground text-sm">
          Study cards show the two highest-weight themes. Use weight 10 for primary themes and 2–5 for context.
        </p>
        <StudyContentThemesList studyId={studyId} items={linkedThemes} />
      </div>
      <div className="space-y-3 border-t pt-8">
        <h3 className="text-sm font-medium">Add theme</h3>
        <StudyContentThemeAddForm
          studyId={studyId}
          themes={themes}
          linkedThemes={linkedThemes}
        />
      </div>
    </div>
  );
}
