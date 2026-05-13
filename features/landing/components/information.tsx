import { ChevronRight } from "lucide-react";
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
  title = "Master Your Game with Volt Coaching",
  description = "Get expert guidance and personalized feedback to take your chess skills to the next level. Whether you're a beginner or an experienced player, our coaches are here to help you improve your game.",
  imageSrc = "/images/hero/bg-volt-ninja.jpg",
  imageAlt = "3D strategy illustration",
}: InformationProps) {
  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="container mx-auto max-w-5xl">
        <div className="flex gap-6 rounded-2xl rounded-b-none bg-white p-8">
          <div className="flex-1 gap-4 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">{step}</span>
            </div>
            <h2 className="mt-4 text-4xl font-bold text-black/80">{title}</h2>
            <p className="text-lg leading-relaxed text-black/60">{description}</p>
          </div>
          <div className="-mt-25 overflow-hidden rounded-full">
            <Image src={imageSrc} alt={imageAlt} width={350} height={350} priority={false} />
          </div>
        </div>
        <div className="bg-primary rounded-2xl rounded-t-none p-8">
          <h3 className="text-xl font-bold text-white">Let's Meet</h3>
          <Button variant="volt" size="lg" asChild></Button>
        </div>
      </div>
    </section>
  );
}
