import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

type ProgressStatsCardProps = {
  percentage: number;
  label: string;
  icon: LucideIcon;
  className?: string;
};

export function ProgressStatsCard({ percentage, label, icon: Icon, className }: ProgressStatsCardProps) {
  const value = Math.min(100, Math.max(0, percentage));

  return (
    <Card className={cn("shrink-0 self-start", className)}>
      <CardHeader className="pb-1">
        <div className="flex items-center gap-3">
          <Icon className="size-10 shrink-0 opacity-90" strokeWidth={2.5} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-wider uppercase">{label}</p>
            <p className="mt-1 text-2xl leading-none">{percentage}%</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Progress className="h-2.5" value={value} />
      </CardContent>
    </Card>
  );
}
