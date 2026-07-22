"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";

type Props = {
  src: string;
  name: string;
};

export function AnimationPreview({ src, name }: Props) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Failed to load (${response.status})`);
        const data = (await response.json()) as object;
        if (!cancelled) setAnimationData(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load animation");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className="border-border flex min-h-0 flex-col gap-3 rounded-lg border p-4">
      <div className="bg-muted/40 flex aspect-square items-center justify-center overflow-hidden rounded-md">
        {error ? (
          <p className="text-destructive px-3 text-center text-xs">{error}</p>
        ) : animationData ? (
          <Lottie animationData={animationData} loop autoplay className="size-full max-h-48 max-w-48" />
        ) : (
          <Spinner className="size-6" />
        )}
      </div>
      <div className="min-w-0 space-y-1">
        <p className="truncate font-medium">{name}</p>
        <p className="text-muted-foreground truncate font-mono text-xs">{src}</p>
      </div>
    </div>
  );
}
