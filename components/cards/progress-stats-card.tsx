import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

type ProgressStatsCardProps = {
  percentage: number;
  label: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
};

/**
 * shrink-0: Flex container içinde daralmasını engeller (yanındaki elemanlar büyüse bile bu kart sıkışmaz).
 * self-start: Parent flex ise, cross-axis’te (genelde dikey) karta start hizası verir.
 */
export function ProgressStatsCard({
  percentage,
  label,
  imageSrc,
  imageAlt,
  className,
}: ProgressStatsCardProps) {
  const value = Math.min(100, Math.max(0, percentage));

  return (
    <Card
      className={cn(
        "ring-border shrink-0 self-start bg-transparent p-4 ring-2",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg">
          <Image
            src={imageSrc}
            alt={imageAlt ?? label}
            width={40}
            height={40}
            className="size-10 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-base font-semibold">
            {label}
          </p>
          <p className="text-2xl font-bold">{percentage}%</p>
        </div>
      </div>
      <Progress className="mt-1 h-2" value={value} />
    </Card>
  );
}
