// TODO: Refactor
"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  type UpdateUsernameFormState,
  updateUsernameAction,
} from "@/features/profile/actions/update-username";

const initialState: UpdateUsernameFormState = {
  error: null,
  success: false,
};

type ProfileUsernameFormProps = {
  initialUsername: string | null;
  displayName: string;
};

export function ProfileUsernameForm({ initialUsername, displayName }: ProfileUsernameFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateUsernameAction, initialState);
  const usernameFieldId = "profile-username";

  useEffect(() => {
    if (!state.success) return;
    setIsEditing(false);
    router.refresh();
  }, [router, state.success]);

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold">{displayName}</p>
        <Button
          type="button"
          variant="voltIcon"
          size="icon-xs"
          title="Edit username"
          aria-label="Edit username"
          onClick={() => setIsEditing(true)}
        >
          <Pencil />
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          id={usernameFieldId}
          name="username"
          defaultValue={initialUsername ?? ""}
          placeholder="Choose a username"
          required
          maxLength={50}
          className="max-w-xs"
          autoFocus
        />
        <div className="flex gap-2">
          <Button type="submit" variant="volt" disabled={isPending}>
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            Save
          </Button>
          <Button
            type="button"
            variant="voltMuted"
            disabled={isPending}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
      {state.error ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
