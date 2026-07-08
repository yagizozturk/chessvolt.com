// TODO: Refactor
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyDataMessageProps = {
  message: string;
  className?: string;
};

export function EmptyDataMessage({ message, className }: EmptyDataMessageProps) {
  return (
    <div
      className={cn(
        "bg-muted/50 flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl px-4 py-16 text-center",
        className,
      )}
    >
      <AlertTriangle className="text-destructive h-10 w-10" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
