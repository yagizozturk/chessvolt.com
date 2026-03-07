import Link from "next/link";
import { Check, BookOpen, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type CheckpointStatus = "complete" | "current" | "locked";

export type JourneyCheckpoint = {
  id: string;
  title: string;
  status: CheckpointStatus;
  index: number;
};

type Props = {
  checkpoints: JourneyCheckpoint[];
  baseHref?: string;
};

const SNAKE_OFFSETS = [0, 40, 70, 40, -10, -50];

function getOffset(index: number): string {
  return `${SNAKE_OFFSETS[index % SNAKE_OFFSETS.length]}px`;
}

export function JourneySnakeMap({ checkpoints, baseHref = "/game-riddle" }: Props) {
  return (
    <div className="relative flex w-full max-w-[400px] flex-col items-center gap-8">
      {checkpoints.map((checkpoint) => {
        const isLocked = checkpoint.status === "locked";
        const isComplete = checkpoint.status === "complete";
        const isCurrent = checkpoint.status === "current";

        const node = (
          <div
            key={checkpoint.id}
            className="relative transition-transform hover:scale-110"
            style={{ transform: `translateX(${getOffset(checkpoint.index)})` }}
          >
            {isCurrent && (
              <Badge className="bg-primary text-primary-foreground absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce px-3 py-1">
                {checkpoint.title}
              </Badge>
            )}

            <Button
              size="icon"
              variant={isLocked ? "ghost" : "default"}
              className={`h-16 w-16 rounded-full border-b-4 transition-all active:border-b-0 ${
                isComplete
                  ? "border-primary/80 bg-primary hover:bg-primary/90"
                  : isCurrent
                    ? "border-primary bg-primary shadow-lg hover:bg-primary/90"
                    : "pointer-events-none border-border bg-muted text-muted-foreground"
              }`}
              asChild={!isLocked}
            >
              {isLocked ? (
                <span>
                  <Lock className="h-6 w-6" />
                </span>
              ) : (
                <Link href={`${baseHref}/${checkpoint.id}`}>
                  {isComplete ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <BookOpen className="h-6 w-6" />
                  )}
                </Link>
              )}
            </Button>
          </div>
        );

        return node;
      })}

      <div className="absolute top-0 bottom-0 -z-10 w-1 rounded-full bg-muted" />
    </div>
  );
}
