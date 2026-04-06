import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Goal } from "lucide-react";
import Image from "next/image";

const activeGoalCardClass =
  "bg-primary text-primary-foreground ring-1 ring-primary/25";
const activeGoalMutedTextClass = "text-primary-foreground/85";

/** Yeşil dolu daire, ortada beyaz check. */
function FilledRoundCheckmark({ size = "md" }: { size?: "sm" | "md" }) {
  const outer = size === "md" ? "size-10" : "size-8";
  const inner = size === "md" ? "size-4" : "size-3.5";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-600/25 dark:bg-emerald-600 dark:ring-emerald-400/30",
        outer,
      )}
      aria-hidden
    >
      <Check className={inner} strokeWidth={3} />
    </span>
  );
}

export type GoalStepperItem = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** Tamamlanan hedef: yeşil tema + sağda dolu yuvarlak check. */
  completed?: boolean;
};

export type GoalStepperProps = {
  items: GoalStepperItem[];
  /** 0-tabanlı; vurgulanacak hedef (büyük kart + açıklama). */
  activeIndex: number;
  className?: string;
};

export function GoalStepper({
  items,
  activeIndex,
  className,
}: GoalStepperProps) {
  if (items.length === 0) return null;

  const safeIndex = Math.min(Math.max(activeIndex, 0), items.length - 1);

  return (
    <div
      role="list"
      aria-label="Goals"
      className={cn("flex flex-col gap-3", className)}
    >
      {items.map((item, index) => {
        const isActive = index === safeIndex;

        if (isActive) {
          const done = item.completed;
          return (
            <div key={index} role="listitem" aria-current="step">
              <Card
                className={cn(
                  "gap-0 overflow-hidden py-0 shadow-md",
                  done
                    ? "border-emerald-500/45 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500/25 dark:border-emerald-500/40 dark:bg-emerald-950/55 dark:text-emerald-50 dark:ring-emerald-400/20"
                    : activeGoalCardClass,
                )}
              >
                <div className="flex flex-row items-start gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-left">
                    <CardTitle
                      className={cn(
                        "text-lg leading-snug font-semibold",
                        done && "text-emerald-950 dark:text-emerald-50",
                      )}
                    >
                      {item.title}
                    </CardTitle>
                    <CardDescription
                      className={cn(
                        "text-sm leading-relaxed",
                        done
                          ? "text-emerald-900/85 dark:text-emerald-100/90"
                          : activeGoalMutedTextClass,
                      )}
                    >
                      {item.description}
                    </CardDescription>
                  </div>
                  {done ? (
                    <span className="mt-0.5 shrink-0 self-start">
                      <FilledRoundCheckmark size="md" />
                    </span>
                  ) : null}
                </div>
              </Card>
            </div>
          );
        }

        const done = item.completed;
        return (
          <div
            key={index}
            role="listitem"
            className={cn(
              "rounded-xl border px-3 py-2 shadow-none transition-opacity",
              done
                ? "border-emerald-500/40 bg-emerald-50/95 text-emerald-950 dark:border-emerald-500/35 dark:bg-emerald-950/50 dark:text-emerald-50"
                : "border-border bg-card/60 opacity-75 hover:opacity-90",
            )}
          >
            <div className="flex min-w-0 flex-row items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs font-medium",
                    done
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-muted-foreground",
                  )}
                >
                  <Goal className="size-3.5 shrink-0" aria-hidden />
                  Goal {index + 1}
                </div>
                <p
                  className={cn(
                    "line-clamp-2 min-w-0 text-sm font-medium",
                    done
                      ? "text-emerald-900 dark:text-emerald-100"
                      : "text-muted-foreground",
                  )}
                >
                  {item.title}
                </p>
              </div>
              {done ? (
                <span className="mt-0.5 shrink-0 self-start">
                  <FilledRoundCheckmark size="sm" />
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
