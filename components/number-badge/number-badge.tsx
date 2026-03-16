import { cn } from "@/lib/utilities/cn";

type IterationBadgeProps = {
  num: number;
  className?: string;
};

export function IterationBadge({ num, className }: IterationBadgeProps) {
  return (
    <span
      className={cn(
        "bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl border-2 border-current text-sm font-bold",
        className,
      )}
    >
      {num}
    </span>
  );
}
