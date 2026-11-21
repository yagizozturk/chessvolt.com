"use client";

import { Zap } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";

import { VOLT_CONFIG, roundPercent } from "@/components/calculator/volt-calculator/volt.config";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

/** Fill above the low threshold. */
export const VOLT_BATTERY_GOOD_COLOR = "#55c057";
/** Fill at or below the low threshold. */
export const VOLT_BATTERY_LOW_COLOR = "#d94a32";
/** Readout color where it sits on top of the fill (both fills are mid-tone, so dark reads best). */
const TEXT_ON_FILL_COLOR = "#1f1f1f";
/** Outline + terminal: dark grey in light mode, light grey in dark mode. */
const OUTLINE_COLOR = "color-mix(in oklch, var(--foreground) 78%, var(--background))";

// Everything is sized in `em`; the root font-size is width / EM_PER_WIDTH, so the same
// proportions hold from a 30px row icon to a 200px dialog battery.
const EM_PER_WIDTH = 20;
const BODY_HEIGHT_EM = 9;

/** Starts at `initial` and moves to `target` on the next frame so the first paint animates. */
function useAnimatedPercent(target: number, initial: number): number {
  const [displayed, setDisplayed] = useState(initial);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setDisplayed(target));
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return displayed;
}

function Readout({
  value,
  start,
  delaySeconds,
  color,
}: {
  value: number;
  start: number;
  delaySeconds: number;
  color: string;
}) {
  return (
    <span
      className="flex items-center font-bold tabular-nums"
      style={{ fontSize: "3.4em", lineHeight: 1, gap: "0.08em", whiteSpace: "nowrap", color }}
    >
      <Zap className="shrink-0 fill-current" strokeWidth={0} style={{ width: "0.8em", height: "0.8em" }} />
      <span>
        %
        <NumberTicker
          value={value}
          startValue={start}
          delay={delaySeconds}
          className="tracking-normal text-inherit dark:text-inherit"
        />
      </span>
    </span>
  );
}

export type VoltBatteryProps = {
  /** Charge 0–100. Rounded with `roundPercent` (whole number, never above 100). */
  percent: number;
  /** Charge to animate from (default 0). */
  initialPercent?: number;
  /** Rendered width in px (body + terminal); height follows the battery proportions. */
  width?: number;
  /** Show Zap + percentage inside the battery. Off for small row icons. */
  showReadout?: boolean;
  /** Charge at or below this % is drawn in the low (red) color. */
  lowThreshold?: number;
  /** Duration of a charge change, in milliseconds. */
  duration?: number;
  /** Delay before the charge starts moving, in milliseconds. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
};

/**
 * Flat battery icon: grey outline, rounded terminal bump, inset fill growing left → right,
 * and Zap + percentage written inside. Pure CSS + one lucide icon.
 *
 * <VoltBattery percent={46} width={180} />
 * <VoltBattery percent={46} width={30} showReadout={false} />   // row icon
 */
export function VoltBattery({
  percent,
  initialPercent = 0,
  width = 160,
  showReadout = true,
  lowThreshold = VOLT_CONFIG.lowFillPercent,
  duration = 1000,
  delay = 0,
  className,
  style,
  "aria-label": ariaLabel = "Volt battery",
  "aria-hidden": ariaHidden,
}: VoltBatteryProps) {
  const target = roundPercent(percent);
  const start = Math.min(target, roundPercent(initialPercent));
  const fill = useAnimatedPercent(target, start);
  const color = target <= lowThreshold ? VOLT_BATTERY_LOW_COLOR : VOLT_BATTERY_GOOD_COLOR;
  const milliseconds = Number.isFinite(duration) ? Math.max(0, duration) : 1000;
  const delayMs = Math.max(0, delay);
  const transition = (property: string) => `${property} ${milliseconds}ms cubic-bezier(0.22, 0.7, 0.3, 1) ${delayMs}ms`;

  return (
    <div
      role={ariaHidden ? undefined : "progressbar"}
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-valuemin={ariaHidden ? undefined : 0}
      aria-valuemax={ariaHidden ? undefined : 100}
      aria-valuenow={ariaHidden ? undefined : target}
      aria-valuetext={ariaHidden ? undefined : `${target}% charged`}
      className={cn("inline-flex shrink-0 items-center", className)}
      style={{ fontSize: width / EM_PER_WIDTH, width, ...style }}
    >
      {/* Body: outline + gap + inset fill */}
      <div
        className="min-w-0 flex-1"
        style={{
          height: `${BODY_HEIGHT_EM}em`,
          borderRadius: "1.7em",
          border: `max(1.5px, 0.6em) solid ${OUTLINE_COLOR}`,
          padding: "max(1px, 0.7em)",
        }}
      >
        <div className="relative h-full w-full">
          {target > 0 ? (
            <div
              className="absolute inset-y-0 left-0 motion-reduce:transition-none"
              style={{
                width: `${fill}%`,
                minWidth: fill > 0 ? "1.2em" : 0,
                borderRadius: "0.8em",
                background: color,
                transition: transition("width"),
              }}
            />
          ) : null}

          {showReadout ? (
            <div aria-hidden>
              {/* Base layer: theme text color over the empty part */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Readout value={target} start={start} delaySeconds={delayMs / 1000} color="var(--foreground)" />
              </div>
              {/* Same readout in dark, clipped to the fill so it stays readable on the color */}
              <div
                className="absolute inset-0 flex items-center justify-center motion-reduce:transition-none"
                style={{
                  clipPath: `inset(0 ${100 - fill}% 0 0)`,
                  transition: transition("clip-path"),
                }}
              >
                <Readout value={target} start={start} delaySeconds={delayMs / 1000} color={TEXT_ON_FILL_COLOR} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Terminal: rounded bump touching the body */}
      <div
        className="shrink-0"
        style={{
          width: "max(2px, 1.1em)",
          height: "3.2em",
          marginLeft: "-0.05em",
          borderRadius: "0 1.6em 1.6em 0 / 0 1.6em 1.6em 0",
          background: OUTLINE_COLOR,
        }}
      />
    </div>
  );
}

export default VoltBattery;
