import { Circle } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type BoardPlayerNameProps = {
  name: string | null;
  elo: string | null;
  color: "white" | "black";
  className?: string;
};

export function BoardPlayerName({ name, elo, color, className }: BoardPlayerNameProps) {
  if (!name) return null;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Circle className={color === "white" ? "h-4 w-4 shrink-0 fill-white" : "h-4 w-4 shrink-0 fill-black"} />
      <span className="truncate text-base font-medium">{name}</span>
      {elo ? <span className="text-muted-foreground shrink-0 text-sm">{elo}</span> : null}
    </div>
  );
}
