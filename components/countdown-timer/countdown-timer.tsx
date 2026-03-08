"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CountdownTimerProps = {
  /** Başlangıç dakikası - bu değerden 0'a doğru geri sayar */
  minutes: number;
  /** Geri sayım bittiğinde çağrılır */
  onComplete?: () => void;
  /** Ek CSS sınıfları */
  className?: string;
  /** Saniye formatı: "mm:ss" veya "ss" */
  format?: "mm:ss" | "ss";
};

function formatTime(totalSeconds: number, format: "mm:ss" | "ss"): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (format === "ss") {
    return String(totalSeconds);
  }

  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function CountdownTimer({
  minutes,
  onComplete,
  className,
  format = "mm:ss",
}: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(true);

  // minutes prop değiştiğinde süreyi sıfırla
  useEffect(() => {
    setSecondsLeft(minutes * 60);
    setIsRunning(true);
  }, [minutes]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onComplete]);

  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        secondsLeft <= 10 && "text-destructive",
        className,
      )}
    >
      {formatTime(secondsLeft, format)}
    </span>
  );
}
