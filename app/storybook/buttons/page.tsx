import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VoltButton } from "@/components/ui/volt-button";
import { CodeViewer } from "../components/code-viewer";
import { StorybookPage } from "../page";

const buttonExamples = [
  {
    name: "Button",
    variant: "default",
    size: "default",
    label: "Continue",
    code: `<Button>Continue</Button>`,
    preview: <Button>Continue</Button>,
  },
  {
    name: "Button",
    variant: "outline",
    size: "default",
    label: "Cancel",
    code: `<Button variant="outline">Cancel</Button>`,
    preview: <Button variant="outline">Cancel</Button>,
  },
  {
    name: "Button",
    variant: "ghost",
    size: "default",
    label: "See Stats",
    code: `<Button variant="ghost">See Stats</Button>`,
    preview: <Button variant="ghost">See Stats</Button>,
  },
  {
    name: "Button",
    variant: "secondary",
    size: "sm",
    label: "Detay",
    code: `<Button variant="secondary" size="sm">Detay</Button>`,
    preview: (
      <Button variant="secondary" size="sm">
        Detay
      </Button>
    ),
  },
  {
    name: "VoltButton",
    variant: "custom",
    size: "default",
    label: "Play on ChessVolt",
    code: `<VoltButton>Play on ChessVolt</VoltButton>`,
    preview: <VoltButton>Play on ChessVolt</VoltButton>,
  },
] as const;

export default function StorybookButtonsPage() {
  return (
    <StorybookPage>
      <section id="buttons" className="space-y-6">
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            Buttons
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Sayfada yalnizca ornek buton varyasyonlari gosterilir.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {buttonExamples.map((example) => (
            <div
              key={example.code}
              className="bg-muted/40 flex flex-col gap-3 rounded-md border p-4"
            >
              <div className="flex items-center">{example.preview}</div>

              <Separator />

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground">Component:</span>{" "}
                  {example.name}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Variant:</span>{" "}
                  <code className="bg-muted rounded px-1 py-0.5 text-xs">
                    {example.variant}
                  </code>
                  {" · "}
                  <span className="text-muted-foreground">Size:</span>{" "}
                  <code className="bg-muted rounded px-1 py-0.5 text-xs">
                    {example.size}
                  </code>
                </p>
                <CodeViewer code={example.code} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </StorybookPage>
  );
}
