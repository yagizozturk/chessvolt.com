"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type SuccessOverlayProps = {
  /** Whether to show the overlay */
  show: boolean;
  /** Optional earned points to display (e.g. for riddle challenges) */
  earnedPoints?: number;
};

export function SuccessOverlay({ show, earnedPoints }: SuccessOverlayProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
      <Card className="animate-in zoom-in-95 fade-in-0 min-w-[280px] border-emerald-500/40 bg-emerald-50/95 shadow-xl duration-200 dark:border-emerald-400/30 dark:bg-emerald-950/95">
        <CardContent className="flex flex-col items-center gap-6 px-12 py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-3 text-center">
            <p className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              Doğru!
            </p>
            {earnedPoints !== undefined && earnedPoints > 0 && (
              <Badge
                variant="secondary"
                className="border-emerald-500/30 bg-emerald-500/20 px-4 py-1.5 text-base font-semibold text-emerald-700 dark:text-emerald-300"
              >
                +{earnedPoints} puan
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
