"use client";

import Image from "next/image";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

type OnboardingPlatformUsernameStepProps = {
  chesscomUsername: string;
  lichessUsername: string;
  onChesscomUsernameChange: (value: string) => void;
  onLichessUsernameChange: (value: string) => void;
  disabled?: boolean;
};

export function OnboardingPlatformUsernameStep({
  chesscomUsername,
  lichessUsername,
  onChesscomUsernameChange,
  onLichessUsernameChange,
  disabled = false,
}: OnboardingPlatformUsernameStepProps) {
  return (
    <section className="space-y-4" aria-labelledby="onboarding-platform-username-heading">
      <div className="space-y-2 text-center">
        <Text as="h2" variant="heading" id="onboarding-platform-username-heading">
          Link your chess account
        </Text>
        <Text variant="muted" as="p">
          Let us know you better..
        </Text>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-6">
        <Field className="flex min-w-0 flex-1 flex-col">
          <div className="mb-2 flex h-28 items-center justify-center">
            <Image
              src="/images/form/chess-com-logo.png"
              alt="Chess.com"
              width={120}
              height={112}
              className="max-h-full max-w-full rounded-xl object-contain"
            />
          </div>
          <FieldLabel htmlFor="onboarding-chesscom-username" className="sr-only">
            Chess.com username
          </FieldLabel>
          <Input
            id="onboarding-chesscom-username"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Chess.com username"
            value={chesscomUsername}
            onChange={(event) => onChesscomUsernameChange(event.target.value)}
            disabled={disabled}
          />
        </Field>

        <Field className="flex min-w-0 flex-1 flex-col">
          <div className="mb-2 flex h-28 items-center justify-center">
            <Image
              src="/images/form/lichess-logo.png"
              alt="Lichess"
              width={80}
              height={80}
              className="max-h-full max-w-full rounded-xl object-contain"
            />
          </div>
          <FieldLabel htmlFor="onboarding-lichess-username" className="sr-only">
            Lichess username
          </FieldLabel>
          <Input
            id="onboarding-lichess-username"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Lichess username"
            value={lichessUsername}
            onChange={(event) => onLichessUsernameChange(event.target.value)}
            disabled={disabled}
          />
        </Field>
      </div>
    </section>
  );
}
