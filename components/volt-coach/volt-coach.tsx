import Image from "next/image";

import { TypingAnimation } from "../ui/typing-animation";

type VoltCoachProps = {
  title: string;
  message: string;
};

export function VoltCoach({ title, message }: VoltCoachProps) {
  return (
    <div className="bg-card flex gap-4 rounded-xl p-4">
      <div className="shrink-0">
        <Image src="/images/avatar/volt-avatar.jpg" alt="Volt Coach" width={80} height={80} className="rounded-xl" />
      </div>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <TypingAnimation
          typeSpeed={50}
          deleteSpeed={150}
          pauseDelay={2000}
          blinkCursor={true}
          className="text-muted-foreground leading-normal"
        >
          {message}
        </TypingAnimation>
      </div>
    </div>
  );
}
