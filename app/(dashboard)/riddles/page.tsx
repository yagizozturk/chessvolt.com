import { PageHeader } from "@/components/page-header";
import { ThemeList } from "@/features/theme/components/theme-list";
import { getAllActiveThemes } from "@/features/theme/services/theme.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function RiddlesPage() {
  const { supabase } = await getPublicUser();
  const themes = await getAllActiveThemes(supabase);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Page header */}
        <PageHeader title="Your riddles" description="Riddles you've tried to solve." />

        {/* Theme list */}
        <ThemeList themes={themes} />
      </div>
    </div>
  );
}
