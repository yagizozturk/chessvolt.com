import { cn } from "@/lib/utils";

type JsonViewerProps = {
  data: unknown;
  title?: string;
  className?: string;
  preClassName?: string;
  muted?: boolean;
};

export function JsonViewer({ data, title, className, preClassName, muted = true }: JsonViewerProps) {
  const content = typeof data === "string" ? data : JSON.stringify(data, null, 2);

  return (
    <div className={cn("space-y-2", className)}>
      {title ? <p className={cn("text-xs", muted ? "text-muted-foreground" : "text-foreground")}>{title}</p> : null}
      <pre
        className={cn(
          "bg-muted/30 max-h-52 overflow-auto rounded-md border p-3 font-mono text-xs whitespace-pre-wrap",
          muted ? "text-muted-foreground" : "text-foreground",
          preClassName,
        )}
      >
        {content}
      </pre>
    </div>
  );
}
