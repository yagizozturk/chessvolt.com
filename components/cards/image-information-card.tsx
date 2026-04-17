import { Card } from "@/components/ui/card";
import { COLOR_MAP } from "@/lib/shared/constants/color-map";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import * as React from "react";

type ImageInformationCardProps = React.HTMLAttributes<HTMLDivElement> & {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
  color?: keyof typeof COLOR_MAP;
};

export default function ImageInformationCard({
  imageSrc,
  imageAlt,
  title,
  description,
  color = "mint",
  className,
  style,
  ...props
}: ImageInformationCardProps) {
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
      <div className="flex items-center gap-4">
        <div className="relative aspect-[2/3] h-28 shrink-0 overflow-hidden rounded-md">
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </Card>
  );
}
