// TODO: Refactor
"use client";

import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

import { TTSController } from "@/features/tts/components/tts-controller/tts-controller";
import { useVoltCoachSoundStore } from "@/lib/shared/store/volt-coach-sound-store";

import { Button } from "../ui/button";
import { Highlighter } from "../ui/highlighter";

type VoltCoachProps = {
  title: string;
  message: string;
  ttsKey: string | number;
  ttsText?: string;
  mainStrategy?: string;
  isFirstPly?: boolean;
};

export function VoltCoach({ title, message, ttsKey, ttsText, mainStrategy, isFirstPly = false }: VoltCoachProps) {
  const enabled = useVoltCoachSoundStore((s) => s.enabled);
  const toggle = useVoltCoachSoundStore((s) => s.toggle);
  const muted = !enabled;
  const trimmedMainStrategy = mainStrategy?.trim() ?? "";
  const showMainStrategy = isFirstPly && trimmedMainStrategy.length > 0;

  return (
    <div className="relative flex gap-4 rounded-xl p-4">
      <TTSController key={ttsKey} text={ttsText ?? message} muted={muted} />
      {/* min-w-0 needs to be refactored after max 2 words prompt */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex">
          <div className="flex-1 truncate text-lg font-semibold">
            {showMainStrategy ? (
              <Highlighter action="highlight" color="#FF9800">
                The Main Idea
              </Highlighter>
            ) : (
              title
            )}
          </div>
        </div>
        {showMainStrategy ? <p>{trimmedMainStrategy}</p> : null}
        <div className="text-muted-foreground w-full leading-normal">{message ? message : null}</div>
      </div>
      <div className="shrink-0">
        <Image src="/images/avatar/volt-coach.png" alt="Volt Coach" width={110} height={110} />
      </div>
      <Button
        type="button"
        variant="voltIcon"
        size="icon-sm"
        className="absolute right-4 bottom-4"
        aria-label={muted ? "Unmute coach" : "Mute coach"}
        onClick={toggle}
      >
        {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </Button>
    </div>
  );
}
