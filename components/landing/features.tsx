import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Puzzle, Map, Lightbulb } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Find The Legend Player's Move",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      badge: "Puzzle",
      icon: Puzzle,
      image: "/images/hero/landing_page_1.png",
    },
    {
      title: "Journey",
      description:
        "Yol haritasıyla adım adım ilerleyin. Magnus’tan oyunları öğrenin ve pratik yapın.",
      badge: "Journey",
      icon: Map,
      image: "/images/hero/landing_page_1.png",
    },
    {
      title: "Opening Reportoires",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      badge: "Riddle",
      icon: Lightbulb,
      image: "/images/hero/landing_page_1.png",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex gap-2 rounded-full px-6 py-2 text-base backdrop-blur-md [&_svg]:size-5"
          >
            <Gamepad2 />
            Oyun Bölümü
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Oyun Modları
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-[700px] md:text-lg">
            Satranç becerilerinizi farklı oyunlarla geliştirin.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:border-primary/50 overflow-hidden border-2 transition-all hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-4 flex flex-col gap-4">
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 text-primary w-fit gap-2 rounded-full px-4 py-1 backdrop-blur-md [&_svg]:size-4"
                  >
                    <feature.icon />
                    {feature.badge}
                  </Badge>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
