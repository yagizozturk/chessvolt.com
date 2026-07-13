// TODO: Refactor
"use client";

import { ListPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import { addRiddleToMyCollectionAction } from "@/features/riddle/actions/add-riddle-to-my-collection";

export type UserCollectionProps = {
  id: string;
  title: string;
};

type AddToUserCollectionPickerProps = {
  riddleId: string;
  collections: UserCollectionProps[];
  savedCollectionIds: string[];
};

const ERROR_MESSAGES: Record<string, string> = {
  collection_not_found: "Collection not found.",
  not_custom_collection: "You can only add riddles to your own collections.",
  already_added: "This riddle is already in that collection.",
  failed: "Could not add the riddle. Please try again.",
};

export function AddToUserCollectionPicker({ riddleId, collections, savedCollectionIds }: AddToUserCollectionPickerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [savedIds, setSavedIds] = useState(() => new Set(savedCollectionIds));
  const [isPending, startTransition] = useTransition();
  const [pendingCollectionId, setPendingCollectionId] = useState<string | null>(null);

  useEffect(() => {
    setSavedIds(new Set(savedCollectionIds));
  }, [savedCollectionIds]);

  const handleSelect = (collectionId: string) => {
    if (savedIds.has(collectionId) || isPending) return;

    setPendingCollectionId(collectionId);
    startTransition(async () => {
      try {
        const result = await addRiddleToMyCollectionAction(riddleId, collectionId);

        if (result.ok) {
          setSavedIds((prev) => new Set([...prev, collectionId]));
          toast.success("Riddle added to collection");
          setOpen(false);
          router.refresh();
          return;
        }

        toast.error(ERROR_MESSAGES[result.reason] ?? "Something went wrong.");
      } finally {
        setPendingCollectionId(null);
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="voltIcon"
        onClick={() => setOpen(true)}
        disabled={isPending}
        aria-label="Add to collection"
        title="Add to collection"
      >
        {isPending ? <Spinner /> : <ListPlus className="size-5" />}
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Add to collection"
        description="Choose one of your collections to save this riddle."
      >
        <Command>
          <CommandInput placeholder="Search collections..." />
          <CommandList>
            <CommandEmpty>
              {collections.length === 0 ? (
                <span>
                  You don&apos;t have any collections yet.{" "}
                  <Link href="/user-collection" className="text-primary underline">
                    Create one
                  </Link>
                </span>
              ) : (
                "No collections match your search."
              )}
            </CommandEmpty>
            {collections.length > 0 ? (
              <CommandGroup heading="My collections">
                {collections.map((collection) => {
                  const isSaved = savedIds.has(collection.id);
                  const isSaving = pendingCollectionId === collection.id;

                  return (
                    <CommandItem
                      key={collection.id}
                      value={collection.title}
                      disabled={isSaved || isPending}
                      onSelect={() => handleSelect(collection.id)}
                    >
                      {collection.title}
                      {isSaving ? <Spinner className="ml-auto size-4" /> : null}
                      {isSaved ? <span className="text-muted-foreground text-xs">Added</span> : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
