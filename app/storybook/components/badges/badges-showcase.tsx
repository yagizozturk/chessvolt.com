import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChessQueen } from "lucide-react";

export function BadgesShowcase() {
  return (
    <section id="badges" className="space-y-6">
      <div>
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          Badges
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Landing sayfasindaki iconlu ve ikonsuz badge ornekleri.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-md border bg-muted/40 p-4">
        <div className="flex items-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary rounded-full px-4 py-2 backdrop-blur-md"
          >
            <ChessQueen className="h-4 w-4" />
            Free to Play
          </Badge>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Component:</span> Badge
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Variant:</span>{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              outline
            </code>
          </p>
          <pre className="overflow-x-auto rounded-md border bg-muted p-3 text-sm leading-relaxed text-foreground">
            <code>{`<Badge
  variant="outline"
  className="border-primary/20 bg-primary/10 text-primary rounded-full px-4 py-2 backdrop-blur-md"
>
  <ChessQueen className="h-4 w-4" />
  Free to Play
</Badge>`}</code>
          </pre>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md border bg-muted/40 p-4">
        <div className="flex items-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary w-fit gap-1 rounded-full px-3 py-0.5 text-xs backdrop-blur-md"
          >
            Popular
          </Badge>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Component:</span> Badge
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Variant:</span>{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              outline
            </code>
          </p>
          <pre className="overflow-x-auto rounded-md border bg-muted p-3 text-sm leading-relaxed text-foreground">
            <code>{`<Badge
  variant="outline"
  className="border-primary/20 bg-primary/10 text-primary w-fit gap-1 rounded-full px-3 py-0.5 text-xs backdrop-blur-md"
>
  Popular
</Badge>`}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
