import { Target } from "lucide-react";

type AttemptAccuracyStatProps = {
  accuracyPercent: number | null | undefined;
};

export function AttemptAccuracyStat({ accuracyPercent }: AttemptAccuracyStatProps) {
  if (accuracyPercent == null) return null;

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
      <Target className="text-primary h-3.5 w-3.5 shrink-0" />
      <span>{accuracyPercent}% accuracy</span>
    </span>
  );
}
