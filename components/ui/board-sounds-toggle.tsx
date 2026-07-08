// TODO: Refactor
"use client";

import { Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBoardSoundsStore } from "@/lib/shared/store/board-sounds-store";

// Toggle handler + dynamic label for menu actions (e.g. sidebar Settings submenu).
export function useBoardSoundsMenuAction() {
  const enabled = useBoardSoundsStore((s) => s.enabled);
  const toggle = useBoardSoundsStore((s) => s.toggle);

  return {
    toggle,
    label: enabled ? "Mute Sounds" : "Unmute Sounds",
  };
}

export function BoardSoundsToggle({ className }: { className?: string }) {
  const enabled = useBoardSoundsStore((s) => s.enabled);
  const toggle = useBoardSoundsStore((s) => s.toggle);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className}
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute board sounds" : "Unmute board sounds"}
    >
      {enabled ? (
        <Volume2 className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <VolumeX className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
