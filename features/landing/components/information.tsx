import { ChessKnight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type InformationProps = {
  step?: string;
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  readMoreHref?: string;
};

/**
 * Split hero card: white upper band, orange lower band, copy on the left,
 * illustration on the right overlapping both bands (“out of the box”).
 */
export function Information({
  step = "Volt Coaching ",
  title = "Master Your Game with Volt",
  description = "Train with Volt, a smart chess companion that explains moves, guides your decisions, and helps you improve one idea at a time. From openings to critical positions, it turns every lesson into a clear step toward better chess.",
  imageSrc = "/images/hero/bg-lets-meet.png",
  imageAlt = "Volt Coach",
}: InformationProps) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex gap-6 rounded-2xl rounded-b-none bg-white p-6">
        <div className="flex-1 space-y-6">
          <h3 className="text-primary text-xl font-bold">{step}</h3>
          <h2 className="text-secondary mt-4 text-4xl font-bold">{title}</h2>
          <p className="text-secondary/80 text-lg leading-relaxed">{description}</p>
        </div>
        <div className="-mt-14 overflow-hidden rounded-full">
          <Image src={imageSrc} alt={imageAlt} width={300} height={300} priority={false} />
        </div>
      </div>
      <div className="flex justify-end rounded-2xl rounded-t-none bg-mist-200 p-8">
        <Button variant="volt" asChild>
          <Link href="/login" className="flex items-center gap-2">
            <ChessKnight className="h-4 w-4" />
            Start Learning
          </Link>
        </Button>
      </div>
    </div>
  );
}
