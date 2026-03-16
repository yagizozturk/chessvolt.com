type IterationBadgeProps = {
  num: number;
};

export function IterationBadge({ num }: IterationBadgeProps) {
  return (
    <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl border-2 border-current text-sm font-bold">
      {num}
    </span>
  );
}
