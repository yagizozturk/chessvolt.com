import type { PgnPairedDisplay } from "@/lib/chess/extractMovesFromPgn";
import { cn } from "@/lib/utilities/cn";

export function PgnPairedBlock({
  display,
  className,
}: {
  display: PgnPairedDisplay;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {display.startComment ? (
        <p className="text-muted-foreground border-muted border-l-2 pl-2 text-xs whitespace-pre-wrap">
          {display.startComment}
        </p>
      ) : null}
      {display.rows.map((row, i) => (
        <div key={i} className="space-y-1">
          <p className="font-mono text-xs">
            {row.blackSan ? `${row.whiteSan} - ${row.blackSan}` : row.whiteSan}
          </p>
          {row.whiteComment || row.blackComment ? (
            <div className="text-muted-foreground border-muted space-y-1 border-l-2 pl-2 text-xs">
              {row.whiteComment ? (
                <p className="whitespace-pre-wrap">{row.whiteComment}</p>
              ) : null}
              {row.blackComment ? (
                <p className="whitespace-pre-wrap">{row.blackComment}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
