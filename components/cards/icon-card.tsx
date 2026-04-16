import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { COLOR_MAP } from "@/lib/shared/constants/color-map";
import { cn } from "@/lib/utils/cn";

type IconCardProps = React.HTMLAttributes<HTMLDivElement> & {
  icon: LucideIcon;
  color?: keyof typeof COLOR_MAP;
};

export function IconCard({
  icon: Icon,
  color = "mint",
  className,
  style,
  ...props
}: IconCardProps) {
  const rgb = COLOR_MAP[color];

  return (
    <Card
      className={cn(
        "card-gamified shrink-0 self-start border-2 p-4 transition-transform hover:-translate-y-1",
        className,
      )}
      style={
        {
          "--brand-rgb": rgb,
          ...style,
        } as React.CSSProperties
      }
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

