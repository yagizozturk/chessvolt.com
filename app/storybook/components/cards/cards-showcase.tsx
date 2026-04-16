import { IconCard } from "@/components/cards/icon-card";
import { IconInformationCard } from "@/components/cards/icon-information-card";
import ImageInformationCard from "@/components/cards/image-information-card";
import { ImageStatsCard } from "@/components/cards/image-stats-card";
import { ProgressStatsCard } from "@/components/cards/progress-stats-card";
import { Separator } from "@/components/ui/separator";
import { Activity, Info, Trophy } from "lucide-react";

import { CodeViewer } from "../code-viewer";

const iconInformationCardColors = [
  "mint",
  "blue",
  "purple",
  "amber",
  "emerald",
  "indigo",
  "rose",
  "cyan",
  "orange",
  "pink",
] as const;

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

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
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
            <CodeViewer
              code={`<ImageStatsCard
  imageSrc="/images/cards/card-alt2-objective.png"
  label="Solved Puzzles"
  value="1,284"
/>`}
            />
          </div>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
          <div className="flex items-start">
            <div className="w-full max-w-sm">
              <IconCard icon={Info} />
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Component:</span> IconCard
            </p>
            <CodeViewer code={`<IconCard icon={Info} />`} />
          </div>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
          <div className="flex items-start">
            <div className="w-full max-w-sm">
              <ImageInformationCard
                imageSrc="/images/cards/card-alt2-core-idea.png"
                title="Caro-Kann Core Idea"
                description="Capture central squares."
              />
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Component:</span>{" "}
              ImageInformationCard
            </p>
            <CodeViewer
              code={`<ImageInformationCard
  imageSrc="/images/cards/card-alt2-core-idea.png"
  title="Caro-Kann Core Idea"
  description="Capture central squares."
/>`}
            />
          </div>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
          <div className="flex items-start">
            <div className="w-full max-w-sm">
              <ProgressStatsCard
                percentage={74}
                label="Accuracy"
                icon={Trophy}
              />
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Component:</span>{" "}
              ProgressStatsCard
            </p>
            <CodeViewer
              code={`<ProgressStatsCard
  percentage={74}
  label="Accuracy"
  icon={Trophy}
/>`}
            />
          </div>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
          <div className="flex items-start">
            <div className="w-full">
              <div className="grid grid-cols-2 gap-3">
                {iconInformationCardColors.map((color, index) => (
                  <IconInformationCard
                    key={color}
                    value={932 + index}
                    label={`${color.toUpperCase()} Theme`}
                    icon={Activity}
                    color={color}
                  />
                ))}
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Component:</span>{" "}
              IconInformationCard
            </p>
            <CodeViewer
              code={`<IconInformationCard
  value={932}
  label="Total Games"
  icon={Activity}
  color="mint"
/>

// color prop'u alir.
// Renk opsiyonlari:
// "mint" | "blue" | "purple" | "amber" | "emerald"
// | "indigo" | "rose" | "cyan" | "orange" | "pink"`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
