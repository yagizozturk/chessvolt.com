import type { LucideIcon } from "lucide-react";
import Image from "next/image";

export type FeatureItemProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
};

export function FeatureItem({ title, description, icon: Icon, imageSrc, imageAlt }: FeatureItemProps) {
  return (
    <div className="flex flex-1 flex-col gap-8 rounded-2xl bg-[#633dcc] p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 flex-1 text-2xl font-bold">{title}</h2>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Icon className="text-primary h-6 w-6" />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border-6 border-white">
        <Image src={imageSrc} alt={imageAlt} width={300} height={300} className="h-auto w-full object-cover" />
      </div>
      <p className="text-center text-base">{description}</p>
    </div>
  );
}
1;
