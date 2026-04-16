import ImageInformationCard from "@/components/cards/image-information-card";
import { ImageStatsCard } from "@/components/cards/image-stats-card";
import { ProgressStatsCard } from "@/components/cards/progress-stats-card";
import { IconInformationCard } from "@/components/cards/icon-information-card";
import { Separator } from "@/components/ui/separator";
import { Activity, Trophy } from "lucide-react";

export function CardsShowcase() {
  return (
    <section id="cards" className="space-y-6">
      <div>
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          Cards
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Projede kullanilan kart komponentlerinin ornekleri.
        </p>
      </div>

      <div className="grid gap-3 rounded-md border bg-muted/40 p-4">
        <div className="flex items-start">
          <div className="w-full max-w-sm">
            <ImageStatsCard
              imageSrc="/images/cards/card-alt2-objective.png"
              label="Solved Puzzles"
              value="1,284"
            />
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Component:</span>{" "}
            ImageStatsCard
          </p>
          <pre className="overflow-x-auto rounded-md border bg-muted p-3 text-sm leading-relaxed text-foreground">
            <code>{`<ImageStatsCard
  imageSrc="/images/cards/card-alt2-objective.png"
  label="Solved Puzzles"
  value="1,284"
/>`}</code>
          </pre>
        </div>
      </div>

      <div className="grid gap-3 rounded-md border bg-muted/40 p-4">
        <div className="flex items-start">
          <div className="w-full max-w-sm">
            <ImageInformationCard
              imageSrc="/images/cards/card-alt2-core-idea.png"
              title="Caro-Kann Core Idea"
              description="Capture central squares and keep a solid pawn structure."
            />
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Component:</span>{" "}
            ImageInformationCard
          </p>
          <pre className="overflow-x-auto rounded-md border bg-muted p-3 text-sm leading-relaxed text-foreground">
            <code>{`<ImageInformationCard
  imageSrc="/images/cards/card-alt2-core-idea.png"
  title="Caro-Kann Core Idea"
  description="Capture central squares and keep a solid pawn structure."
/>`}</code>
          </pre>
        </div>
      </div>

      <div className="grid gap-3 rounded-md border bg-muted/40 p-4">
        <div className="flex items-start">
          <div className="w-full max-w-sm">
            <ProgressStatsCard percentage={74} label="Accuracy" icon={Trophy} />
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Component:</span>{" "}
            ProgressStatsCard
          </p>
          <pre className="overflow-x-auto rounded-md border bg-muted p-3 text-sm leading-relaxed text-foreground">
            <code>{`<ProgressStatsCard
  percentage={74}
  label="Accuracy"
  icon={Trophy}
/>`}</code>
          </pre>
        </div>
      </div>

      <div className="grid gap-3 rounded-md border bg-muted/40 p-4">
        <div className="flex items-start">
          <div className="w-full max-w-sm">
            <IconInformationCard value={932} label="Total Games" icon={Activity} />
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Component:</span>{" "}
            IconInformationCard
          </p>
          <pre className="overflow-x-auto rounded-md border bg-muted p-3 text-sm leading-relaxed text-foreground">
            <code>{`<IconInformationCard
  value={932}
  label="Total Games"
  icon={Activity}
/>`}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
