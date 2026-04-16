import { Progress } from "@/components/ui/progress";

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
    <div className="rounded-lg border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <Progress value={percentage} className="h-2.5" />
    </div>
  );
}
