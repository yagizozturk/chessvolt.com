import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { StorybookPage } from "../page";

export default function StorybookCardsPage() {
  return (
    <StorybookPage>
      <section id="cards" className="space-y-6">
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">Cards</h2>
          <p className="text-muted-foreground mt-1 text-sm">Projede kullanilan kart komponentlerinin ornekleri.</p>
        </div>

        <Card className="h-72 border-0 shadow-none">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-sm">Card Footer</p>
          </CardFooter>
        </Card>
      </section>
    </StorybookPage>
  );
}
