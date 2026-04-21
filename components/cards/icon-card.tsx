import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type IconCardProps = React.HTMLAttributes<HTMLDivElement> & { icon: LucideIcon };

export function IconCard({
  icon: Icon,
  className,
  ...props
}: IconCardProps) {
  return (
    <Card
      className={cn(
        "shrink-0 self-start p-4 transition-transform hover:-translate-y-1",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Icon
          className="size-10 shrink-0 opacity-90"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </div>
    </Card>
  );
}

