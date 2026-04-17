import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChessQueen } from "lucide-react";
import { CodeViewer } from "../components/code-viewer";
import { StorybookSidebar } from "../components/storybook-sidebar";

export default function StorybookBadgesPage() {
  return (
    <SidebarProvider>
      <StorybookSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto p-6">
          <section id="badges" className="space-y-6">
            <div>
              <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                Badges
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Landing sayfasindaki iconlu ve ikonsuz badge ornekleri.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                    <span className="text-muted-foreground">Component:</span>{" "}
                    Badge
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Variant:</span>{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      outline
                    </code>
                  </p>
                  <CodeViewer
                    code={`<Badge
  variant="outline"
  className="border-primary/20 bg-primary/10 text-primary rounded-full px-4 py-2 backdrop-blur-md"
>
  <ChessQueen className="h-4 w-4" />
  Free to Play
</Badge>`}
                  />
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
                    <span className="text-muted-foreground">Component:</span>{" "}
                    Badge
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Variant:</span>{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      outline
                    </code>
                  </p>
                  <CodeViewer
                    code={`<Badge
  variant="outline"
  className="border-primary/20 bg-primary/10 text-primary w-fit gap-1 rounded-full px-3 py-0.5 text-xs backdrop-blur-md"
>
  Popular
</Badge>`}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
