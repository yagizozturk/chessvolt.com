import Image from "next/image";

type ImageInfoCardProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
};

export function ImageInfoCard({ imageSrc, imageAlt, title, description }: ImageInfoCardProps) {
  return (
    <div className="bg-muted/50 flex gap-4 rounded-xl p-4">
      <div className="overflow-hidden rounded-lg">
        <Image src={imageSrc} alt={imageAlt} width={120} height={120} className="h-24 w-64 object-cover" />
      </div>
      <div className="flex min-w-0 flex-col justify-between">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
