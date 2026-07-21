import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { UserFavouriteOpeningVariants } from "@/features/user-favourites/components/user-favourite-opening-variants";
import { UserFavouriteRiddles } from "@/features/user-favourites/components/user-favourite-riddles";
import { VoltsViewFilter } from "@/features/volts/components/volts-view-filter";
import { parseVoltsView } from "@/features/volts/types/volts-view";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Volts | ChessVolt",
  description: "Your Volt scores and progress.",
};

type SearchParams = Promise<{ view?: string }>;

export default async function VoltsPage({ searchParams }: { searchParams: SearchParams }) {
  const { user, supabase } = await getAuthenticatedUser();
  const params = await searchParams;
  const view = parseVoltsView(params.view);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Volts"
          description="Your Volt scores and progress."
          actions={<VoltsViewFilter view={view} />}
        />

        {view === "riddles" ? (
          <UserFavouriteRiddles userId={user.id} supabase={supabase} />
        ) : (
          <UserFavouriteOpeningVariants userId={user.id} supabase={supabase} />
        )}
      </div>
    </div>
  );
}
