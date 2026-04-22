import Image from "next/image";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ImageTooltipBadgeProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  size?: number;
};

export default function ImageTooltipBadge({ imageSrc, imageAlt, title, size = 32 }: ImageTooltipBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Image src={imageSrc} alt={imageAlt} width={size} height={size} />
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          <span>{title}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
