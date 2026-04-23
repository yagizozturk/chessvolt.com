import { Fragment, type ReactNode } from "react";

const termClassName =
  "text-primary font-medium underline decoration-primary/70 underline-offset-[3px] rounded-sm px-0.5";

function renderGoalDescription(description: string) {
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(description)) !== null) {
    if (match.index > last) {
      out.push(description.slice(last, match.index));
    }

    const content = (match[1] ?? match[2] ?? "").trim();
    if (content) {
      out.push(
        <span key={`goal-term-${key++}`} className={termClassName}>
          {content}
        </span>,
      );
    }

    last = re.lastIndex;
  }

  if (last < description.length) {
    out.push(description.slice(last));
  }

  return out.length > 0 ? <Fragment>{out}</Fragment> : description;
}

type GoalDescriptionProps = {
  description: string;
};

export function GoalDescription({ description }: GoalDescriptionProps) {
  return <>{renderGoalDescription(description)}</>;
}
