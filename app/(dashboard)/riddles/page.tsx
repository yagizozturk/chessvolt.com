import { Suspense } from "react";

import { ThemeBrowseSection } from "@/features/theme/components/theme-browse-section";
import { getAllActiveThemes } from "@/features/theme/services/theme.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function RiddlesPage() {
  const { supabase } = await getPublicUser();
  const themes = await getAllActiveThemes(supabase);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <Suspense>
          <ThemeBrowseSection themes={themes} />
        </Suspense>
      </div>
    </div>
  );
}
