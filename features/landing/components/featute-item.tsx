import type { LucideIcon } from "lucide-react";
import Image from "next/image";

export type FeatureItemProps = {
  index: number;
  title: string;
  description: string;
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
};

export function FeatureItem({ index, title, description, icon: Icon, imageSrc, imageAlt }: FeatureItemProps) {
  const step = String(index).padStart(2, "0");

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-lg bg-[#633dcc] p-6">
      <div className="flex items-center justify-between">
        <div className="text-primary text-4xl font-bold">{step}</div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="overflow-hidden rounded-2xl border-6 border-white">
        <Image src={imageSrc} alt={imageAlt} width={300} height={300} className="object-cover" />
      </div>
      <p className="text-muted-foreground text-base">{description}</p>
    </div>
  );
}
