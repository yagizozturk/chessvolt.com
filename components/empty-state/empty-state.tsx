import { cn } from "@/lib/utils";

type EmptyStateProps = {
  message: string;
  className?: string;
};

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div className={cn("bg-muted/40 rounded-xl px-4 py-8 text-center", className)}>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
