import { Progress } from "@/components/ui/progress";
import { Goal } from "lucide-react";

type GoalProgressProps = {
  completedGoals: number;
  totalGoals: number;
};

export default function GoalProgress({
  completedGoals,
  totalGoals,
}: GoalProgressProps) {
  const safeTotal = Math.max(totalGoals, 0);
  const safeCompleted = Math.min(Math.max(completedGoals, 0), safeTotal);
  const percentage =
    safeTotal > 0 ? Math.round((safeCompleted / safeTotal) * 100) : 0;

  return (
    <div className="rounded-lg border-2 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/40">
          <Goal className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Progress
            </span>

            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {safeCompleted}/{safeTotal} Moves ({percentage}%)
            </span>
          </div>

          <Progress value={percentage} className="h-2.5" />
        </div>
      </div>
    </div>
  );
}
