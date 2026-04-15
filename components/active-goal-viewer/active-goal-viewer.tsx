import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

const activeGoalCardClass =
  "bg-primary text-primary-foreground ring-1 ring-primary/25";
const activeGoalMutedTextClass = "text-primary-foreground/85";

export type GoalStepperItem = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** Tamamlanan hedef: yeşil tema ile gösterilir. */
  completed?: boolean;
};

export type GoalStepperProps = {
  items: GoalStepperItem[];
  activeIndex: number;
  className?: string;
};

export function ActiveGoalViewer({
  items,
  activeIndex,
  className,
}: GoalStepperProps) {
  if (items.length === 0) return null;

  const safeIndex = Math.min(Math.max(activeIndex, 0), items.length - 1);
  const activeItem = items[safeIndex];
  const isCompleted = activeItem.completed;

  return (
    <div
      role="list"
      aria-label="Goals"
      className={cn("flex flex-col gap-3", className)}
    >
      <div role="listitem" aria-current="step">
        <Card
          className={cn(
            "gap-0 overflow-hidden py-0 shadow-md",
            isCompleted
              ? "border-emerald-500/45 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500/25 dark:border-emerald-500/40 dark:bg-emerald-950/55 dark:text-emerald-50 dark:ring-emerald-400/20"
              : activeGoalCardClass,
          )}
        >
          <div className="flex flex-row items-start gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-white/25 ring-1 ring-white/20">
              <Crown className="size-8 text-zinc-700 opacity-90" aria-hidden />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-left">
              <CardTitle
                className={cn(
                  "text-lg leading-snug font-semibold",
                  isCompleted && "text-emerald-950 dark:text-emerald-50",
                )}
              >
                {activeItem.title}
              </CardTitle>
              <CardDescription
                className={cn(
                  "text-sm leading-relaxed",
                  isCompleted
                    ? "text-emerald-900/85 dark:text-emerald-100/90"
                    : activeGoalMutedTextClass,
                )}
              >
                {activeItem.description}
              </CardDescription>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
