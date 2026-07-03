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
  step = "Volt Coaching",
  title = "Volt coaches you with the ideas behind the moves",
  description = "Train with Volt, a smart chess companion that explains moves, guides your decisions, and helps you improve one idea at a time. From openings to critical positions, it turns every lesson into a clear step toward better chess.",
  imageSrc = "/images/avatar/volt-coach-avatar.png",
  imageAlt = "Volt Coach",
}: InformationProps) {
  return (
    <section className="bg-[#502DB6] pt-12 pb-16">
      <div className="container mx-auto max-w-5xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-6 rounded-2xl rounded-b-none bg-white p-4 md:flex-row md:p-6">
          <div className="order-2 flex-1 space-y-4 md:order-1 md:space-y-6">
            <h3 className="text-primary text-center text-lg font-bold md:text-left md:text-xl">{step}</h3>
            <h2 className="text-secondary text-center text-[clamp(1.5rem,4vw+1rem,2.25rem)] font-bold md:text-left">
              {title}
            </h2>
            <p className="text-secondary/80 text-center text-base leading-relaxed md:text-left md:text-lg">{description}</p>
          </div>
          <div className="order-1 mx-auto shrink-0 overflow-hidden rounded-2xl md:order-2 md:mx-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={300}
              height={300}
              priority={false}
              className="mx-auto h-auto w-full max-w-[220px] md:max-w-none"
            />
          </div>
        </div>
        <div className="flex justify-center rounded-2xl rounded-t-none bg-mist-200 p-6 md:justify-end md:p-8">
          <Button variant="volt" asChild>
            <Link href="/login" className="flex items-center gap-2">
              <ChessKnight className="h-4 w-4" />
              Start Learning
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
