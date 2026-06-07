"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { CollectionCard } from "@/features/collection/components/collection-card";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import { MyPracticeOpeningsTab } from "@/features/user-practice-opening-variant/components/my-practice-openings-tab";
import type { UserPracticeOpeningVariantWithDetails } from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";

type MyCollectionsTabsProps = {
  collections: CollectionWithRiddleCountAndThemes[];
  practiceVariants: UserPracticeOpeningVariantWithDetails[];
  voltBySequenceId?: Record<string, VoltScoreResult>;
};

export function MyCollectionsTabs({
  collections,
  practiceVariants,
  voltBySequenceId = {},
}: MyCollectionsTabsProps) {
  return (
    <Tabs defaultValue="collections" className="flex flex-col gap-6">
      <TabsList className="w-full max-w-md">
        <TabsTrigger value="collections">Collections</TabsTrigger>
        <TabsTrigger value="practice">Practice openings</TabsTrigger>
      </TabsList>

      <TabsContent value="collections" className="flex flex-col gap-6">
        <div className="flex justify-end">
          <Button variant="volt" asChild>
            <Link href="/my-collections/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create collection
            </Link>
          </Button>
        </div>
        {collections.length === 0 ? (
          <EmptyDataMessage message="You don't have any collections yet." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="practice">
        <MyPracticeOpeningsTab practiceVariants={practiceVariants} voltBySequenceId={voltBySequenceId} />
      </TabsContent>
    </Tabs>
  );
}
