"use client";

import { type CSSProperties, type SVGProps, useId } from "react";

export type LightningProgressProps = Omit<SVGProps<SVGSVGElement>, "children" | "color" | "viewBox" | "ref"> & {
  /** Current progress. Values outside 0..max are clamped. */
  value: number;
  max?: number;
  /** Any CSS color, including var(--primary). */
  color?: string;
  trackColor?: string;
  /** Keep the surface moving even when value is unchanged. */
  wave?: boolean;
  glow?: boolean;
  /** Duration of a level change, in milliseconds. */
  duration?: number;
  label?: string;
};

// Rounded, filled lightning silhouette. All coordinates use the same viewBox.
const BOLT =
  "M 112 15 Q 115 8 123 8 H 177 Q 188 8 183 18 " +
  "L 140 104 H 181 Q 192 104 185 113 " +
  "L 46 264 Q 37 274 42 261 L 82 163 H 23 " +
  "Q 12 163 18 153 Z";

// A continuous 240-unit wave, extended past both edges of the viewport.
// Moving by exactly one period makes the animation loop without a jump.
const WAVE = "M -240 0 Q -180 -22 -120 0 T 0 0 T 120 0 T 240 0 " + "T 360 0 T 480 0 T 600 0 V 340 H -240 Z";

const STYLES = `
  [data-volt-progress] .volt-progress-level {
    transition: transform var(--volt-progress-duration, 850ms)
      cubic-bezier(0.22, 0.7, 0.3, 1);
  }
  [data-volt-progress] .volt-progress-wave {
    animation: volt-progress-wave-v1 5.5s linear infinite;
  }
  [data-volt-progress] .volt-progress-wave-back {
    animation-duration: 8s;
    animation-direction: reverse;
  }
  [data-volt-progress][data-wave="false"] .volt-progress-wave {
    animation-play-state: paused;
  }
  @keyframes volt-progress-wave-v1 {
    from { transform: translateX(0); }
    to { transform: translateX(-240px); }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-volt-progress] .volt-progress-level { transition: none; }
    [data-volt-progress] .volt-progress-wave { animation: none; }
  }
`;

/**
 * Copy this file into components/LightningProgress.tsx.
 * No packages other than React, no CSS import, no animation library.
 *
 * <LightningProgress value={121} max={220} className="h-40 w-auto" />
 *
 * Update value from your own state or API. The level transitions automatically;
 * the wave keeps moving while the value is stationary. Initial render shows the
 * supplied value immediately. To animate from empty, initially pass value={0}.
 *
 * `wave={false}` freezes the surface; `duration={0}` disables level transitions.
 * Reduced-motion preferences automatically disable both kinds of animation.
 */
export function LightningProgress({
  value,
  max = 100,
  color = "#74df7e",
  trackColor = "#484b49",
  wave = true,
  glow = true,
  duration = 850,
  label = "Volt progress",
  className,
  style,
  ...svgProps
}: LightningProgressProps) {
  // useId keeps clip paths unique across multiple instances and SSR hydration.
  const id = useId();
  const clipId = `volt-progress-clip-${id}`;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.min(safeMax, Math.max(0, value)) : 0;
  const progress = safeValue / safeMax;
  const percent = Math.round(progress * 100);

  // Overshoot the silhouette at both ends: 0 is completely empty and 100 full,
  // regardless of the current phase of either wave.
  const surfaceY = 288 - progress * 296;
  const milliseconds = Number.isFinite(duration) ? Math.max(0, duration) : 850;
  const svgStyle = {
    overflow: "visible",
    display: "inline-block",
    verticalAlign: "middle",
    "--volt-progress-duration": `${milliseconds}ms`,
    ...style,
  } as CSSProperties;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={200}
      height={280}
      {...svgProps}
      className={className}
      style={svgStyle}
      viewBox="0 0 200 280"
      role="progressbar"
      aria-label={svgProps["aria-label"] ?? label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      aria-valuetext={svgProps["aria-valuetext"] ?? `${safeValue} / ${safeMax} (${percent}%)`}
      data-volt-progress=""
      data-wave={wave ? "true" : "false"}
    >
      <style>{STYLES}</style>
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={BOLT} />
        </clipPath>
      </defs>

      <path d={BOLT} fill={trackColor} />

      {/* Filter outside the clip gives only the filled silhouette a soft glow. */}
      <g style={glow ? { filter: `drop-shadow(0 0 8px ${color})` } : undefined}>
        <g clipPath={`url(#${clipId})`}>
          <g className="volt-progress-level" style={{ transform: `translateY(${surfaceY}px)` }}>
            <g transform="translate(0 -3) scale(1 0.65)" opacity={0.22}>
              <path className="volt-progress-wave volt-progress-wave-back" d={WAVE} fill={color} />
            </g>
            <path className="volt-progress-wave" d={WAVE} fill={color} />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default LightningProgress;
