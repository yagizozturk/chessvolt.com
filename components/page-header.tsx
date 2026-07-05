import Image from "next/image";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

const defaultClassName = "bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)]";

export function PageHeader({ title, description, className = defaultClassName }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-2 rounded-xl p-6 ${className}`}>
      <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
      <p className="text-muted-foreground text-sm md:text-base">{description}</p>
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
