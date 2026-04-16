import Image from "next/image";

type ImageInformationCardProps = {
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  description: string;
};

const FALLBACK_INFORMER_IMAGE =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23111827'/%3E%3Cpath d='M32 17a9 9 0 0 0-9 9h5a4 4 0 1 1 8 0c0 1.86-1.14 3.11-2.74 4.6-1.75 1.62-3.76 3.61-3.76 7.4v1h5v-1c0-1.68.8-2.59 2.2-3.89C38.52 32.43 41 29.99 41 26a9 9 0 0 0-9-9Zm-2.5 28a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z' fill='%23ffffff'/%3E%3C/svg%3E";

export default function ImageInformationCard({
  imageSrc,
  imageAlt,
  title,
  description,
}: ImageInformationCardProps) {
  const resolvedImageSrc = imageSrc?.trim()
    ? imageSrc
    : FALLBACK_INFORMER_IMAGE;

  return (
    <div className="flex items-center gap-4 rounded-xl border-2 p-4">
      <div className="relative aspect-[2/3] h-28 shrink-0 overflow-hidden rounded-md">
        <Image
          src={resolvedImageSrc}
          alt={imageAlt ?? title}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
