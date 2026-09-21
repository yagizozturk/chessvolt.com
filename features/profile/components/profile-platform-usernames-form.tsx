"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  type UpdatePlatformUsernamesFormState,
  updatePlatformUsernamesAction,
} from "@/features/profile/actions/update-platform-usernames";

const initialState: UpdatePlatformUsernamesFormState = {
  error: null,
  success: false,
};

type ProfilePlatformUsernamesFormProps = {
  initialChesscomUsername: string | null;
  initialLichessUsername: string | null;
};

export function ProfilePlatformUsernamesForm({
  initialChesscomUsername,
  initialLichessUsername,
}: ProfilePlatformUsernamesFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updatePlatformUsernamesAction, initialState);
  const formKey = `${initialChesscomUsername ?? ""}:${initialLichessUsername ?? ""}`;

  useEffect(() => {
    if (!state.success) return;
    router.refresh();
  }, [router, state.success]);

  return (
    <form key={formKey} action={formAction} className="flex flex-col gap-4">
      <FieldGroup className="gap-4 sm:flex-row">
        <Field data-disabled={isPending ? true : undefined}>
          <FieldLabel htmlFor="profile-chesscom-username">Chess.com username</FieldLabel>
          <Input
            id="profile-chesscom-username"
            name="chesscomUsername"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Chess.com username"
            defaultValue={initialChesscomUsername ?? ""}
            maxLength={50}
            disabled={isPending}
          />
        </Field>

        <Field data-disabled={isPending ? true : undefined}>
          <FieldLabel htmlFor="profile-lichess-username">Lichess username</FieldLabel>
          <Input
            id="profile-lichess-username"
            name="lichessUsername"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Lichess username"
            defaultValue={initialLichessUsername ?? ""}
            maxLength={50}
            disabled={isPending}
          />
        </Field>
      </FieldGroup>

      {state.error ? <FieldError>{state.error}</FieldError> : null}

      <div className="flex items-center justify-end gap-3">
        {state.success && !state.error ? <p className="text-muted-foreground text-sm">Saved.</p> : null}
        <Button type="submit" variant="volt" disabled={isPending}>
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          {isPending ? "Saving..." : "Save accounts"}
        </Button>
      </div>
    </form>
  );
}
