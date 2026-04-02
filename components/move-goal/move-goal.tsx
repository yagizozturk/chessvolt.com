"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { MoveGoal as MoveGoalData } from "@/features/openings/types/opening-variant";
import { cn } from "@/lib/utils/cn";
import { Check, Goal } from "lucide-react";
import Image from "next/image";
import { Fragment, type ReactNode, useMemo, useState } from "react";

const termTriggerClassName =
  "text-primary font-medium underline decoration-primary/70 underline-offset-[3px] hover:bg-primary/12 hover:decoration-primary cursor-pointer rounded-sm px-0.5 transition-colors border-b border-dotted border-primary/45";

/** `**vurgu**` → HoverCard; `*vurgu*` → sadece stil (HoverCard yok). */
function GoalTermHoverCard({ term }: { term: string }) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className={termTriggerClassName}>{term}</span>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm leading-relaxed">{term}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

function renderGoalDescription(description: string) {
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(description)) !== null) {
    if (m.index > last) {
      out.push(description.slice(last, m.index));
    }
    const content = (m[1] ?? m[2] ?? "").trim();
    if (content) {
      if (m[1] !== undefined) {
        out.push(<GoalTermHoverCard key={`g-${k++}`} term={content} />);
      } else {
        out.push(
          <span key={`g-${k++}`} className={termTriggerClassName}>
            {content}
          </span>,
        );
      }
    }
    last = re.lastIndex;
  }
  if (last < description.length) {
    out.push(description.slice(last));
  }
  return out.length > 0 ? <Fragment>{out}</Fragment> : description;
}

// --- Alt Bileşenler ---

const CompletionBadge = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm dark:bg-emerald-500",
      size === "md" ? "h-7 w-7" : "h-6 w-6",
    )}
    aria-label="Goal completed"
  >
    <Check
      className={cn(size === "md" ? "h-4 w-4" : "h-3.5 w-3.5")}
      strokeWidth={2.75}
      aria-hidden
    />
  </span>
);

const GoalIconPlaceholder = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <div
    className={cn(
      "bg-primary/10 text-primary flex shrink-0 items-center justify-center rounded-lg",
      size === "md" ? "h-9 w-9" : "h-7 w-7",
    )}
  >
    <Goal className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden />
  </div>
);

function GoalVisual({
  card,
  highlighted,
}: {
  card: string;
  highlighted: boolean;
}) {
  const [failed, setFailed] = useState(false);

  const src = useMemo(() => {
    const trimmed = card.trim();
    return trimmed ? `/images/cards/card_${trimmed}.png` : null;
  }, [card]);

  if (!highlighted || !src || failed) {
    return <GoalIconPlaceholder size={highlighted ? "md" : "sm"} />;
  }

  return (
    <div className="bg-primary/10 border-primary/5 relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
      <Image
        src={src}
        alt=""
        fill
        className="object-contain p-1"
        onError={() => setFailed(true)}
        sizes="56px"
      />
    </div>
  );
}

// --- Ana Bileşen ---

export type MoveGoalProps = {
  goal: MoveGoalData;
  index: number;
  highlighted: boolean;
  done: boolean;
};

export function MoveGoal({ goal, index, highlighted, done }: MoveGoalProps) {
  const goalLabel = `Goal ${index + 1}`;

  if (!highlighted) {
    return (
      <div
        className={cn(
          "bg-muted/35 flex min-h-10 items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-opacity",
          !done && "opacity-40",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <GoalVisual card={goal.card} highlighted={false} />
          <span className="min-w-0 truncate text-sm font-medium">
            {goalLabel}: {goal.title}
          </span>
        </div>
        {done && <CompletionBadge size="sm" />}
      </div>
    );
  }

  return (
    <Card className="border-primary/30 ring-primary/10 gap-2 shadow-md ring-2 transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate">{goal.title}</span>
            <span className="text-muted-foreground shrink-0 text-xs font-semibold tracking-wider uppercase">
              {goalLabel}
            </span>
          </div>
          {done && <CompletionBadge />}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-4">
          <GoalVisual card={goal.card} highlighted={true} />
          <div className={cn("min-w-0 flex-1", done && "opacity-70")}>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {renderGoalDescription(goal.description)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
