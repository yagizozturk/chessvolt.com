"use client";

import { Spinner } from "@/components/ui/spinner";

type GameAnalysisStatusProps = {
  message: string | null;
  pending?: boolean;
};

export function GameAnalysisStatus({ message, pending = false }: GameAnalysisStatusProps) {
  if (!message) return null;

  return (
    <div className="flex shrink-0 flex-col items-center gap-3" role="status" aria-live="polite">
      {pending ? <Spinner className="size-8" /> : null}
      <p className="text-muted-foreground px-4 text-center text-sm">{message}</p>
    </div>
  );
}
