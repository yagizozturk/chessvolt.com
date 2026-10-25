"use client";

import { type CSSProperties, useId, useState } from "react";

import LightningProgress from "@/components/volt-progress/volt-progress";

export type WhatIsVoltSectionProps = {
  className?: string;
  /** Matches the purple/yellow ChessVolt Hero by default. */
  theme?: "dark" | "light" | "auto";
  /** Starting value for the interactive demo, from 0 to 220. */
  initialValue?: number;
  /** Optional controlled value. Use together with onValueChange. */
  value?: number;
  onValueChange?: (value: number) => void;
};

const MAX_VOLT = 220;
const clampVolt = (value: number) => (Number.isFinite(value) ? Math.round(Math.max(0, Math.min(MAX_VOLT, value))) : 0);

// A few scoped animation and input rules complement Tailwind's layout utilities.
// No Tailwind config changes, global CSS, image assets, or animation package.
const STYLES = `
  .cv-volt-section {
    --cv-surface: #301781;
    --cv-text: #fffaf1;
    --cv-muted: #d4c7f1;
    --cv-accent: #ffd04b;
    --cv-accent-text: #ffd04b;
    --cv-on-accent: #2c1a58;
    --cv-track: #5837b6;
    --cv-line: #c4a5ff24;
    --cv-soft: #ffffff08;
    color-scheme: dark;
    font-family: inherit;
  }
  .cv-volt-section[data-theme="light"] {
    --cv-surface: #faf7ff;
    --cv-text: #2c1a58;
    --cv-muted: #6c5d88;
    --cv-accent: #ffd04b;
    --cv-accent-text: #825900;
    --cv-on-accent: #2c1a58;
    --cv-track: #d9caed;
    --cv-line: #5837b61a;
    --cv-soft: #5837b608;
    color-scheme: light;
  }
  .cv-volt-section[data-theme="auto"] {
    color-scheme: inherit;
    --cv-surface: light-dark(#faf7ff, #301781);
    --cv-text: light-dark(#2c1a58, #fffaf1);
    --cv-muted: light-dark(#6c5d88, #d4c7f1);
    --cv-accent: #ffd04b;
    --cv-accent-text: light-dark(#825900, #ffd04b);
    --cv-on-accent: #2c1a58;
    --cv-track: light-dark(#d9caed, #5837b6);
    --cv-line: light-dark(#5837b61a, #c4a5ff24);
    --cv-soft: light-dark(#5837b608, #ffffff08);
  }
  .cv-volt-section .cv-float {
    animation: cv-volt-float-v1 var(--float-duration, 7s) ease-in-out infinite;
    animation-delay: var(--float-delay, 0s);
    will-change: transform;
  }
  .cv-volt-section .cv-range {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    width: 100%;
    height: 44px;
    margin: 0;
    background-color: transparent;
    background-image: linear-gradient(to right, var(--cv-accent) 0%,
      var(--cv-accent) var(--range-fill), var(--cv-track) var(--range-fill),
      var(--cv-track) 100%);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 5px;
    border-radius: 999px;
    touch-action: pan-y;
  }
  .cv-volt-section .cv-range::-webkit-slider-runnable-track {
    height: 5px;
    background: transparent;
    border-radius: 999px;
  }
  .cv-volt-section .cv-range::-moz-range-track {
    height: 5px;
    background: transparent;
    border-radius: 999px;
  }
  .cv-volt-section .cv-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 21px;
    height: 21px;
    margin-top: -8px;
    border: 4px solid var(--cv-surface);
    border-radius: 50%;
    background: var(--cv-accent);
    box-shadow: 0 0 0 1px var(--cv-accent);
  }
  .cv-volt-section .cv-range::-moz-range-thumb {
    width: 13px;
    height: 13px;
    border: 4px solid var(--cv-surface);
    border-radius: 50%;
    background: var(--cv-accent);
    box-shadow: 0 0 0 1px var(--cv-accent);
  }
  @keyframes cv-volt-float-v1 {
    0%, 100% { transform: translateY(0) rotate(var(--float-rotation, 0deg)); }
    50% { transform: translateY(-10px) rotate(calc(var(--float-rotation, 0deg) + 2deg)); }
  }
  @media (prefers-reduced-motion: reduce) {
    .cv-volt-section .cv-float { animation: none; will-change: auto; }
    .cv-volt-section button { transition: none; }
  }
`;

function floatStyle(duration: number, delay: number, rotation = 0): CSSProperties {
  return {
    "--float-duration": `${duration}s`,
    "--float-delay": `${delay}s`,
    "--float-rotation": `${rotation}deg`,
  } as CSSProperties;
}

/** Small, self-contained vector illustrations. Each instance has unique IDs. */
function KnightIllustration() {
  const id = useId();
  return (
    <svg viewBox="0 0 180 192" fill="none" aria-hidden="true" className="block h-auto w-full">
      <defs>
        <radialGradient id={`${id}-orb`} cx=".3" cy=".2" r=".9">
          <stop stopColor="#e5dafc" />
          <stop offset="1" stopColor="#a58bcf" />
        </radialGradient>
        <linearGradient id={`${id}-ivory`} x1="58" y1="45" x2="129" y2="143" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff4bd" />
          <stop offset=".58" stopColor="#ffd04b" />
          <stop offset="1" stopColor="#cf870d" />
        </linearGradient>
      </defs>
      <circle cx="90" cy="94" r="76" fill={`url(#${id}-orb)`} />
      <ellipse cx="91" cy="160" rx="40" ry="8" fill="#544174" opacity=".22" />
      <path
        d="M64 140c2-26 9-32 18-43l-22 6-14-13 17-21 4-20 17 5 9-17 7 21c25 14 35 39 27 82Z"
        fill="#a56b16"
        transform="translate(3 4)"
      />
      <path
        d="M64 140c2-26 9-32 18-43l-22 6-14-13 17-21 4-20 17 5 9-17 7 21c25 14 35 39 27 82Z"
        fill={`url(#${id}-ivory)`}
      />
      <path
        d="M100 60c16 17 20 40 13 68M90 92c-6 15-13 22-16 37"
        stroke="#dd9d1c"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="m54 87 10 5 13-6" stroke="#cb8716" strokeWidth="3" strokeLinecap="round" />
      <circle cx="76" cy="72" r="3.8" fill="#3b236b" />
      <circle cx="75" cy="71" r="1" fill="white" />
      <path d="m72 52 7 8-8 3" fill="#e9ab26" />
      <path d="M62 136h66l7 13H55Z" fill="#efb932" />
      <rect x="51" y="148" width="88" height="12" rx="6" fill="#ca891c" />
      <rect x="51" y="145" width="88" height="11" rx="5.5" fill="#ffe189" />
      <path d="M61 148h63" stroke="#fff4bf" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RookIllustration() {
  const id = useId();
  return (
    <svg viewBox="0 0 160 180" fill="none" aria-hidden="true" className="block h-auto w-full">
      <defs>
        <radialGradient id={`${id}-orb`} cx=".3" cy=".25" r=".8">
          <stop stopColor="#ffedb5" />
          <stop offset="1" stopColor="#f1cc70" />
        </radialGradient>
        <linearGradient id={`${id}-rook`} x1="45" y1="50" x2="119" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d5bbff" />
          <stop offset=".5" stopColor="#a781e8" />
          <stop offset="1" stopColor="#633eb3" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="88" r="68" fill={`url(#${id}-orb)`} />
      <ellipse cx="80" cy="148" rx="39" ry="8" fill="#7f6234" opacity=".2" />
      <path
        d="M48 47h16v15h11V47h15v15h11V47h15v38l-13 10 7 42H53l8-42-13-10Z"
        fill="#4b287f"
        transform="translate(2 3)"
      />
      <path d="M48 47h16v15h11V47h15v15h11V47h15v38l-13 10 7 42H53l8-42-13-10Z" fill={`url(#${id}-rook)`} />
      <path d="M58 79h48M65 96h31M65 129h31" stroke="#dabdff" strokeWidth="4" strokeLinecap="round" />
      <path d="m66 99-3 25" stroke="#eddaff" strokeWidth="4" strokeLinecap="round" opacity=".65" />
      <rect x="49" y="133" width="63" height="10" rx="4" fill="#8058bd" />
      <rect x="43" y="141" width="76" height="11" rx="5.5" fill="#b48ee4" />
      <path d="M52 144h45" stroke="#e5cfff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PawnIllustration() {
  const id = useId();
  return (
    <svg viewBox="0 0 150 166" fill="none" aria-hidden="true" className="block h-auto w-full">
      <defs>
        <radialGradient id={`${id}-orb`} cx=".3" cy=".2" r=".9">
          <stop stopColor="#ded1ff" />
          <stop offset="1" stopColor="#a992df" />
        </radialGradient>
        <linearGradient id={`${id}-piece`} x1="51" y1="45" x2="99" y2="131" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8d73ad" />
          <stop offset=".55" stopColor="#503376" />
          <stop offset="1" stopColor="#2b1947" />
        </linearGradient>
      </defs>
      <circle cx="75" cy="79" r="62" fill={`url(#${id}-orb)`} />
      <ellipse cx="75" cy="134" rx="35" ry="7" fill="#483263" opacity=".22" />
      <circle cx="75" cy="53" r="20" fill={`url(#${id}-piece)`} />
      <path d="M68 38c-6 1-10 6-10 11" stroke="#e8d8fc" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <path d="M62 77h26c-5 17-3 25 9 42H53c12-17 14-25 9-42Z" fill={`url(#${id}-piece)`} />
      <path d="m68 85-4 22" stroke="#bda2df" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      <rect x="57" y="71" width="36" height="9" rx="4.5" fill="#7958a0" />
      <rect x="48" y="117" width="54" height="10" rx="5" fill="#674589" />
      <rect x="42" y="126" width="66" height="10" rx="5" fill="#49316b" />
      <path d="M50 128h43" stroke="#ba9bce" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BoardIllustration() {
  const id = useId();
  const square = 19;
  return (
    <svg viewBox="0 0 200 208" fill="none" aria-hidden="true" className="block h-auto w-full">
      <defs>
        <linearGradient id={`${id}-frame`} x1="15" y1="15" x2="190" y2="195" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff8e6" />
          <stop offset="1" stopColor="#baa4d3" />
        </linearGradient>
        <clipPath id={`${id}-board`}>
          <rect x="24" y="23" width="152" height="152" rx="4" />
        </clipPath>
      </defs>
      <rect x="12" y="19" width="176" height="176" rx="17" fill="#6c4a9c" />
      <rect x="12" y="12" width="176" height="176" rx="17" fill={`url(#${id}-frame)`} />
      <g clipPath={`url(#${id}-board)`}>
        {Array.from({ length: 64 }, (_, index) => {
          const x = index % 8;
          const y = Math.floor(index / 8);
          return (
            <rect
              key={index}
              x={24 + x * square}
              y={23 + y * square}
              width={square}
              height={square}
              fill={(x + y) % 2 === 0 ? "#f6efdf" : "#9b7cc2"}
            />
          );
        })}
        {/* A small illustrative position, not an interactive game board. */}
        <rect x="62" y="99" width="19" height="19" fill="#ffd04b" />
        <rect x="81" y="61" width="19" height="19" fill="#ffd04b" opacity=".8" />
        <path
          d="M72 109 91 71"
          stroke="#51307f"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="3 5"
          opacity=".45"
        />
        <g transform="translate(119 44)" fill="#3f245e">
          <ellipse cx="9" cy="20" rx="9" ry="3" opacity=".2" />
          <path d="M7 0h4v4h4v3h-4v3l4 6H3l4-6V7H3V4h4Z" />
          <rect x="1" y="16" width="16" height="4" rx="2" />
        </g>
        <g transform="translate(63 96)">
          <ellipse cx="9" cy="20" rx="10" ry="3" fill="#3a2252" opacity=".25" />
          <path
            d="m3 16 3-7-4 2-3-3 6-5V0l4 2 2-2 1 4c7 4 6 8 4 12Z"
            fill="#fff9e6"
            stroke="#c6b4ce"
            strokeWidth=".8"
          />
          <circle cx="6" cy="5.5" r="1.1" fill="#49325c" />
          <rect x="0" y="16" width="18" height="4" rx="2" fill="#fff9e6" />
        </g>
        <g transform="translate(139 119)" fill="#fff9e6" stroke="#cfbdcf" strokeWidth=".7">
          <circle cx="8" cy="4" r="4" />
          <path d="M5 8h6l2 8H3Z" />
          <rect x="0" y="16" width="16" height="4" rx="2" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Place next to your existing LightningProgress.tsx, then render:
 * <WhatIsVoltSection />
 *
 * Requires React + Tailwind CSS (v3 or v4); no other dependencies.
 * This is an interactive illustration, not a score calculation or persistence layer.
 */
export function WhatIsVoltSection({
  className = "",
  theme = "dark",
  initialValue = 110,
  value,
  onValueChange,
}: WhatIsVoltSectionProps) {
  const id = useId();
  const [demoValue, setDemoValue] = useState(() => clampVolt(initialValue));
  const current = clampVolt(value ?? demoValue);
  const percent = (current / MAX_VOLT) * 100;

  function updateValue(next: number) {
    const clamped = clampVolt(next);
    if (value === undefined) setDemoValue(clamped);
    onValueChange?.(clamped);
  }

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={`cv-volt-section relative isolate overflow-hidden bg-[var(--cv-surface)] px-5 py-14 text-[var(--cv-text)] sm:px-8 sm:py-20 ${className}`}
      data-theme={theme}
    >
      <style>{STYLES}</style>

      {/* The atmosphere is deliberately quiet; the bolt stays the main focus. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_51%,#7750db33_0%,transparent_62%)]"
      />

      <div className="relative mx-auto max-w-5xl">
        <header className="relative z-10 mx-auto max-w-xl text-center">
          <p className="mb-4 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-[var(--cv-muted)] uppercase sm:text-xs">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--cv-accent)]" />A little practice. A
            lasting habit.
          </p>
          <h2
            id={`${id}-heading`}
            className="m-0 text-[42px] leading-[1.08] font-semibold tracking-[-0.045em] sm:text-[64px] lg:text-[72px]"
          >
            What is <span className="text-[var(--cv-accent-text)]">Volt</span>
            <span className="text-[var(--cv-accent-text)]">?</span>
          </h2>
          <p className="mx-auto mt-5 mb-0 max-w-[390px] text-sm leading-7 text-[var(--cv-muted)] sm:max-w-[430px] sm:text-base">
            Practice day by day to charge your Volt up to 220V.
            <br className="hidden sm:block" /> Take a break, and it gradually fades.
          </p>
        </header>

        <div className="relative mx-auto mt-5 h-[365px] max-w-[900px] sm:mt-3 sm:h-[425px]">
          {/* Decoration has no hit targets and never blocks the controls. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
            <div className="absolute top-[49%] left-1/2 h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--cv-line)] sm:h-[350px] sm:w-[350px]" />
            <div className="absolute top-[49%] left-1/2 hidden h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--cv-line)] opacity-50 sm:block" />

            <div className="absolute top-[14px] left-[0%] w-[70px] sm:top-[26px] sm:left-[11%] sm:w-[125px] lg:left-[15%] lg:w-[150px]">
              <div className="cv-float" style={floatStyle(7, -2, -9)}>
                <KnightIllustration />
              </div>
            </div>
            <div className="absolute top-[30px] right-[0%] w-[64px] sm:top-[53px] sm:right-[10%] sm:w-[105px] lg:right-[16%] lg:w-[128px]">
              <div className="cv-float" style={floatStyle(8.5, -4, 9)}>
                <RookIllustration />
              </div>
            </div>
            <div className="absolute bottom-[32px] left-[5%] hidden w-[148px] sm:block lg:bottom-[26px] lg:left-[9%] lg:w-[177px]">
              <div className="cv-float" style={floatStyle(9, -1, -12)}>
                <BoardIllustration />
              </div>
            </div>
            <div className="absolute right-[8%] bottom-[30px] hidden w-[108px] sm:block lg:right-[10%] lg:bottom-[34px] lg:w-[122px]">
              <div className="cv-float" style={floatStyle(7.7, -3, 7)}>
                <PawnIllustration />
              </div>
            </div>

            <span className="absolute top-[42%] left-[27%] hidden h-2 w-2 rounded-full bg-[#d2b6f4] opacity-60 sm:block" />
            <span className="absolute top-[13%] right-[29%] h-1.5 w-1.5 rounded-full bg-[#ffd04b] opacity-70" />
            <span className="absolute right-[21%] bottom-[36%] hidden h-2 w-2 rounded-full bg-[#c4a5ff] opacity-50 sm:block" />
          </div>

          <div className="relative z-10 flex h-full flex-col items-center pt-[56px] sm:pt-[38px]">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[20%] rounded-full bg-[#ffd04b24] blur-3xl"
              />
              <LightningProgress
                value={current}
                max={MAX_VOLT}
                color="var(--cv-accent)"
                trackColor="var(--cv-track)"
                glow={false}
                duration={750}
                className="relative h-[234px] w-auto sm:h-[290px]"
                label="Demo Volt charge"
                aria-valuetext={`${current} out of 220 Volt`}
              />
            </div>
            <div className="mt-3 flex items-baseline justify-center gap-2 sm:mt-4" aria-hidden="true">
              <span className="min-w-[3ch] text-right text-[42px] leading-none font-medium tracking-[-0.04em] tabular-nums sm:text-[48px]">
                {current}
              </span>
              <span className="text-base font-medium text-[var(--cv-muted)]">
                / 220 <span className="text-[var(--cv-accent-text)]">V</span>
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[310px] text-center">
          <label htmlFor={`${id}-range`} className="text-xs font-medium tracking-wide text-[var(--cv-muted)]">
            Try it. Give your Volt a little charge.
          </label>
          <input
            id={`${id}-range`}
            type="range"
            min={0}
            max={MAX_VOLT}
            step={1}
            value={current}
            onChange={(event) => updateValue(Number(event.target.value))}
            aria-label="Try a Volt score"
            aria-valuetext={`${current} out of 220 Volt`}
            className="cv-range cursor-interaction"
            style={{ "--range-fill": `${percent}%` } as CSSProperties}
          />
          <output htmlFor={`${id}-range`} className="sr-only" aria-live="polite" aria-atomic="true">
            {current} out of 220 Volt
          </output>
          <div className="-mt-1 mb-5 flex justify-between text-[11px] text-[var(--cv-muted)]" aria-hidden="true">
            <span>0 V</span>
            <span>220 V</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => updateValue(current + 55)}
              disabled={current === MAX_VOLT}
              className="cursor-interaction inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[var(--cv-accent)] px-5 py-2.5 text-xs font-semibold text-[var(--cv-on-accent)] shadow-[0_3px_0_#00000024] transition-transform duration-150 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0.5 disabled:opacity-70"
            >
              {current === MAX_VOLT ? (
                "Fully charged"
              ) : (
                <>
                  Practice a day <span className="border-l border-current/20 pl-3 opacity-70">+55 V</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => updateValue(0)}
              disabled={current === 0}
              className="cursor-interaction min-h-11 rounded-md px-2 text-xs font-medium text-[var(--cv-muted)] hover:text-[var(--cv-text)] disabled:opacity-40"
            >
              Reset
            </button>
          </div>
          <p className="mt-4 mb-0 text-[11px] leading-5 text-[var(--cv-muted)]">
            An interactive preview of your practice energy.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhatIsVoltSection;
