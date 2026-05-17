import Image from "next/image";

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
  imageSrc = "/images/hero/bg-volt-confetti.png",
  imageAlt = "Volt Ninja",
}: InformationProps) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex gap-6 rounded-2xl rounded-b-none bg-white p-6">
        <div className="flex-1 space-y-6">
          <h3 className="text-primary text-xl font-bold">{step}</h3>
          <h2 className="text-secondary mt-4 text-4xl font-bold">{title}</h2>
          <p className="text-secondary/80 text-lg leading-relaxed">{description}</p>
        </div>
        <div className="-mt-12 overflow-hidden rounded-full">
          <Image src={imageSrc} alt={imageAlt} width={300} height={300} priority={false} />
        </div>
      </div>
      <div className="bg-primary rounded-2xl rounded-t-none p-8">
        <h3 className="text-foreground text-2xl font-bold">Let's Meet</h3>
      </div>
    </div>
  );
}
