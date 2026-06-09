"use client";

import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import { CreateUserListDialog } from "@/features/user-practices/components/create-user-list-dialog";
import { UserRiddleBoardCard } from "@/features/user-practices/components/user-riddle-board-card";
import { UserPracticeOpeningsTab } from "@/features/user-practice-opening-variant/components/user-practice-opening-variant";
import type { UserPracticeOpeningVariantWithDetails } from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

type UserPracticesProps = {
  userCollections: CollectionWithRiddleCountAndThemes[];
  userPracticeVariants: UserPracticeOpeningVariantWithDetails[];
  voltBySequenceId?: Record<string, VoltScoreResult>;
};

export function UserPracticesTabs({
  userCollections,
  userPracticeVariants,
  voltBySequenceId = {},
}: UserPracticesProps) {
  return (
    <>
      <Tabs defaultValue="collections" className="flex flex-col items-center gap-6">
        <TabsList className="w-full max-w-md" variant="default">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="openings">Openings</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="flex w-full flex-col gap-6">
          {userCollections.length === 0 ? (
            <EmptyDataMessage message="You don't have any collections yet." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {userCollections.map((collection) => (
                <UserRiddleBoardCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="openings" className="w-full">
          <UserPracticeOpeningsTab
            practiceVariants={userPracticeVariants}
            voltBySequenceId={voltBySequenceId}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <CreateUserListDialog />
      </div>
    </>
  );
}
