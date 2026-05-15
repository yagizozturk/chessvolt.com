"use client";

import { useEffect, useState } from "react";
import { EVENTS, STATUS, useJoyride, type EventData } from "react-joyride";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const STEPS = [
  {
    target: '[data-tour="welcome"]',
    title: "Welcome",
    content: "This demo uses react-joyride v3 with the useJoyride hook. Click Start tour or use the controls below.",
    placement: "center" as const,
    skipBeacon: true,
  },
  {
    target: '[data-tour="board"]',
    title: "Chess board",
    content: "Highlight DOM targets with data-tour attributes. For Chessground, spotlight the board wrapper—not individual squares.",
    placement: "right" as const,
  },
  {
    target: '[data-tour="sidebar-title"]',
    title: "Instructions",
    content: "Point users at static UI: titles, cards, and actions in the sidebar.",
    placement: "left" as const,
  },
  {
    target: '[data-tour="hint-cards"]',
    title: "Hint cards",
    content: "Each card can be a step. Advance programmatically when the user completes an in-app action.",
    placement: "left" as const,
  },
  {
    target: '[data-tour="action-button"]',
    title: "Actions",
    content: 'Finish with primary actions. Persist "tour seen" in localStorage or Supabase so it does not repeat.',
    placement: "top" as const,
  },
];

function formatEvent(data: EventData) {
  return `${data.type} · step ${data.index + 1}/${data.size} · ${data.status}`;
}

export default function TestJoyridePage() {
  const [events, setEvents] = useState<string[]>([]);

  const { controls, on, state, Tour } = useJoyride({
    continuous: true,
    scrollToFirstStep: true,
    steps: STEPS,
    options: {
      showProgress: true,
      skipBeacon: true,
      primaryColor: "oklch(0.852 0.199 91.936)",
      overlayColor: "rgba(0, 0, 0, 0.55)",
    },
    locale: {
      last: "Done",
      skip: "Skip tour",
    },
  });

  useEffect(() => {
    const unsubEnd = on(EVENTS.TOUR_END, (data) => {
      setEvents((prev) => [`Tour ended (${data.status})`, ...prev].slice(0, 8));
    });

    const unsubStep = on(EVENTS.TOOLTIP, (data) => {
      setEvents((prev) => [formatEvent(data), ...prev].slice(0, 8));
    });

    return () => {
      unsubEnd();
      unsubStep();
    };
  }, [on]);

  const isRunning = state.status === STATUS.RUNNING || state.status === STATUS.WAITING;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2" data-tour="welcome">
        <h1 className="text-2xl font-bold">React Joyride v3</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Test page at <code className="text-foreground">/test/joyride</code>. Mock layout mirrors the arrows
          exercise (board + sidebar). Status: <span className="text-foreground font-medium">{state.status}</span>
          {state.index >= 0 ? ` · step ${state.index + 1} of ${state.size}` : null}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="volt" onClick={() => controls.start()} disabled={isRunning}>
          Start tour
        </Button>
        <Button type="button" variant="outline" onClick={() => controls.stop()} disabled={!isRunning}>
          Stop
        </Button>
        <Button type="button" variant="outline" onClick={() => controls.reset(true)}>
          Reset &amp; restart
        </Button>
      </div>

      {Tour}

      <div className="flex flex-col gap-4 lg:flex-row">
        <div
          data-tour="board"
          className="bg-muted flex aspect-square w-full max-w-[min(100%,22rem)] items-center justify-center rounded-xl border lg:shrink-0"
        >
          <span className="text-muted-foreground text-sm font-medium">Board area</span>
        </div>

        <div className="bg-card flex min-w-0 flex-1 flex-col gap-4 rounded-xl border p-4">
          <div className="flex items-center justify-center px-4" data-tour="sidebar-title">
            <span className="text-lg font-bold">Draw The Ideal Position</span>
          </div>
          <Separator />
          <div className="flex flex-col gap-3" data-tour="hint-cards">
            {["Knight development", "Control the center", "Castle kingside"].map((title) => (
              <div key={title} className="bg-muted/50 rounded-lg border px-4 py-3 text-sm">
                {title}
              </div>
            ))}
          </div>
          <div className="mt-auto" data-tour="action-button">
            <Button variant="volt" className="w-full" type="button">
              Start Game
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg border p-4">
        <p className="mb-2 text-sm font-medium">Recent events</p>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-xs">Start the tour to see tooltip and tour:end events here.</p>
        ) : (
          <ul className="text-muted-foreground space-y-1 font-mono text-xs">
            {events.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
