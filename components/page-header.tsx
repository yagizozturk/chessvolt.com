import Image from "next/image";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
  /** Optional right-aligned slot (e.g. filters or actions) shown beside the title. */
  actions?: ReactNode;
}

const defaultClassName = "bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)]";

export function PageHeader({ title, description, className = defaultClassName, actions }: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-xl p-6 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
        <p className="text-muted-foreground text-sm md:text-base">{description}</p>
      </div>
      {actions ? <div className="w-full lg:w-auto">{actions}</div> : null}
    </div>
  );
}

interface PageHeaderWithImageProps extends PageHeaderProps {
  imageSrc: string;
  imageAlt?: string;
}

export function PageHeaderWithImage({
  title,
  description,
  imageSrc,
  imageAlt,
  className = defaultClassName,
}: PageHeaderWithImageProps) {
  return (
    <div className={`flex items-center gap-4 rounded-xl ${className}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-6">
        <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
        <p className="text-muted-foreground hidden text-sm md:block md:text-base">{description}</p>
      </div>
      <div className="shrink-0 overflow-hidden rounded-r-xl">
        <Image src={imageSrc} alt={imageAlt ?? title} width={200} height={180} className="object-contain" />
      </div>
    </div>
  );
}
