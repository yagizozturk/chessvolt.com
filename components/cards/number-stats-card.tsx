import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

type NumberStatsCardProps = {
  /** Public path, e.g. `/images/cards/stats-correct.png` */
  imageSrc: string;
  imageAlt?: string;
  label: string;
  value: string | number;
  className?: string;
};

/**
 * Fonksyon Açıklaması ✅
 * Bu fonksiyon, bir sayısal istatistik kartı oluşturur.
 */
export function NumberStatsCard({
  imageSrc,
  imageAlt,
  label,
  value,
  className,
}: NumberStatsCardProps) {
  return (
    <Card className={cn("ring-border bg-transparent ring-2", className)}>
      <CardContent className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl">
          <Image
            src={imageSrc}
            alt={imageAlt ?? label}
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
