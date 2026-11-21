"use client";

import { Zap } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";

import { VOLT_CONFIG } from "@/components/calculator/volt-calculator/volt.config";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

/** Full cell. */
export const VOLT_BATTERY_FULL_COLOR = "#34d399";
/** Partially filled cell above the low threshold. */
export const VOLT_BATTERY_GOOD_COLOR = "#10b981";
/** Cell at or below the low threshold. */
export const VOLT_BATTERY_LOW_COLOR = "#ef4444";

// Everything inside the battery is sized in `em`; the root font-size is width / EM_PER_WIDTH,
// so the same proportions hold from a 30px row icon to a 200px dialog gauge.
const EM_PER_WIDTH = 20;
const BODY_HEIGHT_EM = 9.2;

function clampPercent(value: number): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

function getCellColor(fill: number, lowThreshold: number): string {
  if (fill >= 100) return VOLT_BATTERY_FULL_COLOR;
  if (fill <= lowThreshold) return VOLT_BATTERY_LOW_COLOR;
  return VOLT_BATTERY_GOOD_COLOR;
}

/** Starts at `initial` (default 0) and moves to `targets` on the next frame so the first paint animates. */
function useAnimatedFills(targets: number[], initial?: number[]): number[] {
  const targetKey = targets.join(",");
  const [displayed, setDisplayed] = useState<number[]>(() =>
    targets.map((_, index) => clampPercent(initial?.[index] ?? 0)),
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setDisplayed(targetKey === "" ? [] : targetKey.split(",").map(Number));
    });
    return () => cancelAnimationFrame(frame);
  }, [targetKey]);

  return displayed;
}

export type VoltBatteryProps = {
  /** Fill per cell, 0–100, left to right. One cell per scored day. */
  cells: number[];
  /** Fill per cell to animate from (default: all empty). Cells equal to `cells` stay still. */
  initialCells?: number[];
  /** Cell index drawn with a highlight ring (e.g. the day that is charging). */
  highlightCell?: number;
  /** Overall charge 0–100 (for screen readers). Defaults to the average cell fill. */
  percent?: number;
  /** Rendered width in px (body + terminal); height follows the battery proportions. */
  width?: number;
  /** Cell fill at or below this % is drawn in the low (red) color. */
  lowThreshold?: number;
  /** Soft glow around filled cells. */
  glow?: boolean;
  /** Duration of a fill change, in milliseconds. */
  duration?: number;
  /** Delay between cells when they fill, in milliseconds. */
  stagger?: number;
  /** Delay before the first cell starts filling, in milliseconds. */
  delay?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
};

/**
 * Horizontal battery split into cells that fill bottom-up.
 *
 * <VoltBattery cells={[100, 100, 64, 20, 0]} width={180} />
 */
export function VoltBattery({
  cells,
  initialCells,
  highlightCell,
  percent,
  width = 160,
  lowThreshold = VOLT_CONFIG.lowFillPercent,
  glow = true,
  duration = 900,
  stagger = 110,
  delay = 0,
  label = "Volt battery",
  className,
  style,
  "aria-hidden": ariaHidden,
}: VoltBatteryProps) {
  const targets = cells.map(clampPercent);
  const displayed = useAnimatedFills(targets, initialCells);
  const overall = Math.round(
    clampPercent(percent ?? (targets.length > 0 ? targets.reduce((sum, value) => sum + value, 0) / targets.length : 0)),
  );
  const milliseconds = Number.isFinite(duration) ? Math.max(0, duration) : 900;

  return (
    <div
      role={ariaHidden ? undefined : "progressbar"}
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : label}
      aria-valuemin={ariaHidden ? undefined : 0}
      aria-valuemax={ariaHidden ? undefined : 100}
      aria-valuenow={ariaHidden ? undefined : overall}
      aria-valuetext={ariaHidden ? undefined : `${overall}% full`}
      className={cn("inline-flex shrink-0 items-center", className)}
      style={{ fontSize: width / EM_PER_WIDTH, width, ...style }}
    >
      {/* Body */}
      <div
        className="flex min-w-0 flex-1 gap-[0.6em] p-[0.8em]"
        style={{
          height: `${BODY_HEIGHT_EM}em`,
          borderRadius: "1.9em",
          background: "color-mix(in oklch, var(--muted-foreground) 24%, transparent)",
          boxShadow: "inset 0 0 0 0.1em color-mix(in oklch, var(--foreground) 8%, transparent)",
        }}
      >
        {targets.map((target, index) => {
          const color = getCellColor(target, lowThreshold);
          const fill = displayed[index] ?? 0;

          return (
            <div
              key={index}
              className="relative min-w-0 flex-1"
              style={{
                borderRadius: "1.05em",
                background: "color-mix(in oklch, var(--background) 72%, transparent)",
                boxShadow:
                  highlightCell === index
                    ? "0 0 0 0.18em var(--primary), 0 0 1.2em color-mix(in oklch, var(--primary) 45%, transparent)"
                    : undefined,
              }}
            >
              {target > 0 ? (
                <div
                  className="absolute inset-x-0 bottom-0 motion-reduce:transition-none"
                  style={{
                    height: `${fill}%`,
                    minHeight: fill > 0 ? "0.9em" : 0,
                    borderRadius: "1.05em",
                    background: color,
                    boxShadow: glow ? `0 0 0.9em color-mix(in oklch, ${color} 55%, transparent)` : undefined,
                    transition: `height ${milliseconds}ms cubic-bezier(0.22, 0.7, 0.3, 1) ${Math.max(0, delay) + index * stagger}ms`,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Terminal */}
      <div
        className="shrink-0"
        style={{
          width: "0.7em",
          height: "3.4em",
          marginLeft: "0.3em",
          borderRadius: "0 0.6em 0.6em 0",
          background: "color-mix(in oklch, var(--muted-foreground) 24%, transparent)",
        }}
      />
    </div>
  );
}

export type VoltBatteryGaugeProps = VoltBatteryProps & {
  /** Overall charge 0–100 shown next to the Zap icon. */
  percent: number;
  /** Percentage the counter starts from (default 0). */
  initialPercent?: number;
  /** Optional content under the battery, e.g. "620 / 1000 Volt". */
  caption?: ReactNode;
};

/**
 * Zap + percentage above a VoltBattery, with an optional caption below.
 *
 * <VoltBatteryGauge cells={[100, 100, 64, 20, 0]} percent={57} width={180} caption="570 / 1000 Volt" />
 */
export function VoltBatteryGauge({
  percent,
  initialPercent = 0,
  caption,
  width = 160,
  className,
  ...batteryProps
}: VoltBatteryGaugeProps) {
  const rounded = Math.round(clampPercent(percent));
  const startPercent = Math.min(rounded, Math.round(clampPercent(initialPercent)));
  const tickerDelaySeconds = Math.max(0, batteryProps.delay ?? 0) / 1000;
  const headlineSize = Math.max(12, Math.round(width * 0.17));

  return (
    <div className={cn("inline-flex flex-col items-center", className)} style={{ gap: width * 0.05 }}>
      <div
        className="flex items-center font-semibold tabular-nums"
        style={{ fontSize: headlineSize, lineHeight: 1, gap: headlineSize * 0.2 }}
        aria-hidden
      >
        <Zap
          className="fill-primary text-primary shrink-0"
          style={{
            width: headlineSize * 0.9,
            height: headlineSize * 0.9,
            filter: "drop-shadow(0 0 0.3em var(--primary))",
          }}
        />
        <span>
          %
          <NumberTicker
            value={rounded}
            startValue={startPercent}
            delay={tickerDelaySeconds}
            className="text-foreground tracking-normal"
          />
        </span>
      </div>
      <VoltBattery percent={rounded} width={width} {...batteryProps} />
      {caption ? (
        <div className="text-muted-foreground tabular-nums" style={{ fontSize: Math.max(11, width * 0.075) }}>
          {caption}
        </div>
      ) : null}
    </div>
  );
}

export default VoltBattery;
