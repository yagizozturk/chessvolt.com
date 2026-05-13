import Image from "next/image";

import { Button } from "@/components/ui/button";

export function Chart() {
  return (
    <div className="container mx-auto max-w-6xl px-4 md:px-6">
      <div className="relative rounded-lg p-4">
        <div className="absolute top-4 left-4 z-10">
          <span className="text-4xl font-bold">ELO rises</span>
          <p className="text-muted-foreground text-sm">Your chess skills are improving</p>
          <Button variant="volt" size="sm">
            See Stats
          </Button>
        </div>
        <Image src="/images/hero/bg-chart.png" alt="Chart" width={1000} height={300} />
      </div>
    </div>
  );
}
