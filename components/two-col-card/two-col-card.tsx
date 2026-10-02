import Image from "next/image";

type TwoColCardProps = {
  imageSrc: string;
  imageAlt?: string;
  text: string;
  className?: string;
};

export function TwoColCard({ imageSrc, imageAlt = "", text, className }: TwoColCardProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-4 p-3">
        <div className="flex shrink-0 items-center justify-center rounded-full bg-white p-2">
          <Image src={imageSrc} alt={imageAlt} width={48} height={48} className="size-10" />
        </div>
        <p className="w-36 text-balance leading-tight">{text}</p>
      </div>
    </div>
  );
}
