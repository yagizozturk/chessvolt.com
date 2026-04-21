import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type IconInformationCardProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number | string;
  label: string;
  icon: LucideIcon;
};

export function IconInformationCard({
  value,
  label,
  icon: Icon,
  className,
  ...props
}: IconInformationCardProps) {
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
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-wider uppercase opacity-70">
            {label}
          </p>
          <p className="mt-1 text-2xl leading-none font-black">{value}</p>
        </div>
      </div>
    </Card>
  );
}
