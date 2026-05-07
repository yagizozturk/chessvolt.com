import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { TTSController } from "@/features/tts/components/tts-controller/tts-controller";

import { Button } from "../ui/button";
import { TypingAnimation } from "../ui/typing-animation";

type VoltCoachProps = {
  title: string;
  message: string;
  ttsKey: number;
};

export function VoltCoach({ title, message, ttsKey }: VoltCoachProps) {
  const [muted, setMuted] = useState(false);

  return (
    <div className="bg-card flex gap-4 rounded-xl p-4">
      <TTSController key={ttsKey} text={message} muted={muted} />
      <div className="shrink-0">
        <Image src="/images/avatar/volt-avatar.jpg" alt="Volt Coach" width={80} height={80} className="rounded-xl" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex">
          <div className="flex-1 truncate text-lg font-bold">{title}</div>
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              aria-label={muted ? "Unmute coach" : "Mute coach"}
              onClick={() => setMuted((prev) => !prev)}
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </Button>
          </div>
        </div>
        <TypingAnimation
          as="div"
          typeSpeed={50}
          deleteSpeed={150}
          pauseDelay={2000}
          blinkCursor={true}
          className="text-muted-foreground w-full leading-normal"
        >
          {message}
        </TypingAnimation>
      </div>
    </div>
  );
}
