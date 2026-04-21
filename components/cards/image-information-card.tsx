import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import * as React from "react";

type ImageInformationCardProps = React.HTMLAttributes<HTMLDivElement> & {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
};

export default function ImageInformationCard({
  imageSrc,
  imageAlt,
  title,
  description,
  className,
  ...props
}: ImageInformationCardProps) {
  return (
    <Card
      className={cn(
        "shrink-0 self-start p-4 transition-transform hover:-translate-y-1",
        className,
      )}
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
