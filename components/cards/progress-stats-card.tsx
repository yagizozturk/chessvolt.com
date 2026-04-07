import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { COLOR_MAP } from "@/lib/shared/constants/color-map";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

type ProgressStatsCardProps = {
  percentage: number;
  label: string;
  icon: LucideIcon;
  color?: keyof typeof COLOR_MAP; // Yeni renk prop'u
  className?: string;
};

export function ProgressStatsCard({
  percentage,
  label,
  icon: Icon,
  color = "mint",
  className,
}: ProgressStatsCardProps) {
  const value = Math.min(100, Math.max(0, percentage));
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
        } as React.CSSProperties
      }
    >
      <div className="flex items-center gap-3">
        {/* İkon rengi artık kart rengiyle aynı olacak */}
        <Icon
          className="size-10 shrink-0 opacity-90"
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          {/* Label için biraz opacity ekleyerek hiyerarşi kuruyoruz */}
          <p className="text-[11px] font-bold tracking-wider uppercase opacity-70">
            {label}
          </p>
          <p className="mt-1 text-2xl leading-none font-black">{percentage}%</p>
        </div>
      </div>

      {/* Progress Bar'ı kart rengine boyuyoruz */}
      <Progress
        className="mt-4 h-2.5"
        value={value}
        style={{
          backgroundColor: `rgba(${rgb}, 0.2)`, // Barın boş kısmı
        }}
        // Shadcn Progress içindeki 'indicator' için custom style gerekebilir
        // veya basitçe indicator'a renk geçebiliriz.
      />
    </Card>
  );
}
