import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { Target } from "lucide-react";

type ProgressStatsCardProps = {
  percentage: number;
  label?: string;
  className?: string;
};

export function ProgressStatsCard({
  percentage,
  label = "Finished riddles",
  className,
}: ProgressStatsCardProps) {
  return (
    <Card className={cn("w-44 shrink-0 self-start p-4", className)}>
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
          <Target className="text-primary h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="text-xl font-bold">{percentage}%</p>
        </div>
      </div>
      <div className="bg-muted mt-3 h-2 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </Card>
  );
}
