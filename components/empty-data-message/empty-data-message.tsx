import { cn } from "@/lib/utils";

type EmptyDataMessageProps = {
  message: string;
  className?: string;
};

export function EmptyDataMessage({ message, className }: EmptyDataMessageProps) {
  return (
    <div className={cn("bg-muted/50 rounded-xl px-4 py-8 text-center", className)}>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
