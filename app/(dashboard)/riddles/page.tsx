import { Suspense } from "react";

import { RiddleThemes } from "@/features/theme/components/riddle-themes";
import { getAllActiveThemesWithCoverImage } from "@/features/theme/services/theme.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function RiddlesPage() {
  const { supabase } = await getPublicUser();
  const themes = await getAllActiveThemesWithCoverImage(supabase);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Suspense is used for client side searchParams filter. All themes are loaded on client and with a search, we filter around it  
            But in openings, we filter the search params with a server side query. */}
        <Suspense>
          <RiddleThemes themes={themes} />
        </Suspense>
      </div>
    </div>
  );
}
