import { CollectionHeader } from "@/components/collection/collection-header";

import { CodeViewer } from "../components/code-viewer";
import StorybookPage from "../storybook-page";

export default function CollectionHeaderPage() {
  return (
    <StorybookPage>
      <section className="space-y-6">
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            Collection Header
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            CollectionHeader bileşeninin örnek kullanımı.
          </p>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-md border p-4">
          <div className="rounded-md bg-background p-4">
            <CollectionHeader
              title="Opening Crusher"
              imageSrc="/images/challanges/legend_games2.png"
              imageAlt="Openings"
              description="Test your repertoire skills and master the openings."
              quote="Play the opening like a book, the middlegame like a magician, and the endgame like a machine."
              author="Rudolf Spielmann"
              itemCount={24}
              itemLabel="openings"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Component:</span>{" "}
              CollectionHeader
            </p>
            <CodeViewer
              code={`<CollectionHeader
  title="Opening Crusher"
  imageSrc="/images/challanges/legend_games2.png"
  imageAlt="Openings"
  description="Test your repertoire skills and master the openings."
  quote="Play the opening like a book, the middlegame like a magician, and the endgame like a machine."
  author="Rudolf Spielmann"
  itemCount={24}
  itemLabel="openings"
/>`}
            />
          </div>
        </div>
      </section>
    </StorybookPage>
  );
}