import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import { CreateUserListDialog } from "@/features/user-collection/components/create-user-list-dialog";
import { UserCollectionCard } from "@/features/user-collection/components/user-collection-card";

type UserCollectionListProps = {
  userCollections: CollectionWithRiddleCountAndThemes[];
};

export function UserCollectionList({ userCollections }: UserCollectionListProps) {
  if (userCollections.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyDataMessage message="You don't have any collections yet." />
        <div className="flex justify-end">
          <CreateUserListDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {userCollections.map((collection) => (
          <UserCollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      <div className="flex justify-end">
        <CreateUserListDialog />
      </div>
    </div>
  );
}
