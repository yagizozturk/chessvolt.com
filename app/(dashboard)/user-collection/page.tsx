import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { VoltExplainDialogAutoStart } from "@/components/volt-explain-dialog/volt-explain-dialog-auto-start";
import { getUserCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { CreateUserListDialog } from "@/features/user-collection/components/create-user-list-dialog";
import { UserCollectionCard } from "@/features/user-collection/components/user-collection-card";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function UserCollectionPage() {
  const { user, supabase } = await getAuthenticatedUser();

  const userCollections = await getUserCollectionsWithRiddleCountAndThemes(supabase, user.id);

  return (
    <div className="page-container">
      <div className="page-container-list-layout">
        <PageHeader title="Your collections" description="Collections you've created to organize your riddles." />
        {/*
          Note:
          First-visit auto-open Dialog only; user sees this page after onboarding
          skipped once localStorage marks the intro as seen.
        */}
        <VoltExplainDialogAutoStart />

        {userCollections.length === 0 ? (
          <>
            <EmptyDataMessage message="You don't have any collections yet." />
            <div className="flex justify-center sm:justify-end">
              <CreateUserListDialog />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {userCollections.map((collection) => (
                <UserCollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
            <div className="flex justify-center sm:justify-end">
              <CreateUserListDialog />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
