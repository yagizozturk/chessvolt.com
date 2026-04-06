import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

type NumberStatsCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: "default" | "primary" | "destructive";
  className?: string;
};

const variantStyles = {
  default: {
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    valueColor: "text-foreground",
  },
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    valueColor: "text-primary",
  },
  destructive: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    valueColor: "text-destructive",
  },
};

export function NumberStatsCard({
  icon: Icon,
  label,
  value,
  variant = "primary",
  className,
}: NumberStatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn("bg-secondary/80 ring-0", className)}>
      <CardContent className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-lg",
            styles.iconBg,
          )}
        >
          <Icon className={cn("h-7 w-7", styles.iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className={cn("text-2xl font-bold", styles.valueColor)}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
