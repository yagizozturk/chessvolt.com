// TODO: Refactor
"use client";

import { Pencil } from "lucide-react";
import { useState, useTransition } from "react";

import { updateMyCollectionAction } from "@/app/(dashboard)/user-collection/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

type EditUserListDialogProps = {
  collection: {
    id: string;
    title: string;
    description: string;
  };
};

export function EditUserListDialog({ collection }: EditUserListDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const titleFieldId = `collection-title-${collection.id}`;
  const descriptionFieldId = `collection-description-${collection.id}`;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await updateMyCollectionAction(formData);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="voltIcon" size="icon-xs" title="Edit">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form action={handleSubmit} className="flex flex-col gap-6">
          <input type="hidden" name="id" value={collection.id} />
          <DialogHeader>
            <DialogTitle>Edit collection</DialogTitle>
            <DialogDescription>Update the name and description of your collection.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={titleFieldId}>Name</FieldLabel>
              <Input
                id={titleFieldId}
                name="title"
                placeholder="Collection name"
                defaultValue={collection.title}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={descriptionFieldId}>Description</FieldLabel>
              <Input
                id={descriptionFieldId}
                name="description"
                placeholder="Description (optional)"
                defaultValue={collection.description}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="voltMuted" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="volt" type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
