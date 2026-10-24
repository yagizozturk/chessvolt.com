"use client";

import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

import { TTSController } from "@/features/tts/components/tts-controller/tts-controller";
import { useVoltCoachSoundStore } from "@/lib/shared/store/volt-coach-sound-store";

import { Button } from "../ui/button";

type VoltCoachProps = {
  title: string;
  message: string;
  ttsKey: string | number;
  ttsText?: string;
};

export function VoltCoach({ title, message, ttsKey, ttsText }: VoltCoachProps) {
  const enabled = useVoltCoachSoundStore((s) => s.enabled);
  const toggle = useVoltCoachSoundStore((s) => s.toggle);
  const muted = !enabled;

  return (
    <div className="flex flex-col gap-3">
      <TTSController key={ttsKey} text={ttsText ?? message} muted={muted} />
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Volt Coach</div>
        <Button
          type="button"
          variant="voltIcon"
          size="icon-sm"
          aria-label={muted ? "Unmute coach" : "Mute coach"}
          onClick={toggle}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <Image src="/images/avatar/volt-robot.png" alt="Volt Coach" width={110} height={110} />
        </div>
        {/* min-w-0 needs to be refactored after max 2 words prompt */}
        <div className="bg-card relative flex min-w-0 flex-1 flex-col gap-1 rounded-xl border px-4 py-3">
          <span
            aria-hidden
            className="bg-card absolute top-1/2 -left-[7px] size-3 -translate-y-1/2 rotate-45 border-b border-l"
          />
          <div className="truncate text-lg font-semibold">{title}</div>
          <div className="text-muted-foreground text-sm leading-normal">{message ? message : null}</div>
        </div>
      </div>
    </div>
  );
}
