"use client";

import { Plus } from "lucide-react";
import { useTransition } from "react";

import { createMyCollectionAction } from "@/app/(dashboard)/user-collection/actions";
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

export function CreateUserListDialog() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await createMyCollectionAction(formData);
    });
  };

  return (
    <Dialog>
      <form action={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="volt" type="button">
            <Plus data-icon="inline-start" />
            Create Collection
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create collection</DialogTitle>
            <DialogDescription>Add a new collection to organize your riddles.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="collection-title">Name</FieldLabel>
              <Input id="collection-title" name="title" placeholder="Collection name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="collection-description">Description</FieldLabel>
              <Input id="collection-description" name="description" placeholder="Description (optional)" />
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
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
