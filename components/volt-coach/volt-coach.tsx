"use client";

import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

import { TTSController } from "@/features/tts/components/tts-controller/tts-controller";
import { useBoardSoundsStore } from "@/lib/shared/store/board-sounds-store";

import { Button } from "../ui/button";

type VoltCoachProps = {
  title: string;
  message: string;
  ttsKey: number;
};

export function VoltCoach({ title, message, ttsKey }: VoltCoachProps) {
  const enabled = useBoardSoundsStore((s) => s.enabled);
  const toggle = useBoardSoundsStore((s) => s.toggle);
  const muted = !enabled;

  return (
    <div className="flex gap-4 rounded-xl p-4">
      <TTSController key={ttsKey} text={message} muted={muted} />
      <div className="shrink-0">
        <Image
          src="/images/avatar/volt-coach-avatar.png"
          alt="Volt Coach"
          width={100}
          height={100}
          className="rounded-xl"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex">
          <div className="flex-1 truncate text-lg font-bold">{title}</div>
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              aria-label={muted ? "Unmute coach" : "Mute coach"}
              onClick={toggle}
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </Button>
          </div>
        </div>
        <div className="text-muted-foreground w-full leading-normal">{message}</div>
      </div>
    </div>
  );
}
