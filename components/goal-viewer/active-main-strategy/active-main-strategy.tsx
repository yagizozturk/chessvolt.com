import Image from "next/image";

import type { ActiveMainStrategyProps } from "../types/types";

export function ActiveMainStrategy({ title, message, imageSrc, imageAlt }: ActiveMainStrategyProps) {
  return (
    <div className="relative flex gap-4 rounded-xl p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-muted-foreground w-full leading-normal">{message}</div>
      </div>
      <div className="shrink-0">
        <Image src={imageSrc} alt={imageAlt} width={110} height={110} />
      </div>
    </div>
  );
}
