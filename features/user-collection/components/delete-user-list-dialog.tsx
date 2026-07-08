// TODO: Refactor
"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

import { deleteMyCollectionAction } from "@/app/(dashboard)/user-collection/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type DeleteUserListDialogProps = {
  collection: {
    id: string;
    title: string;
  };
};

export function DeleteUserListDialog({ collection }: DeleteUserListDialogProps) {
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    const formData = new FormData();
    formData.set("id", collection.id);

    startDeleteTransition(async () => {
      await deleteMyCollectionAction(formData);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="voltIcon" size="icon-xs" disabled={isDeleting} title="Delete">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete collection?</AlertDialogTitle>
          <AlertDialogDescription>
            Delete &quot;{collection.title}&quot;? Riddles saved in this collection will be removed from it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="voltMuted">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="volt" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting && <Spinner data-icon="inline-start" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
