"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import VoltBoard from "@/components/boards/volt-board/volt-board";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

type SizingMode = "fixed" | "wrapper" | "observer";

const SIZING_MODES: { value: SizingMode; label: string; description: string }[] = [
  { value: "fixed", label: "Fixed px", description: "Hard-coded pixel size (current production default)" },
  { value: "wrapper", label: "CSS wrapper", description: "board-wrapper class with 100% inner size" },
  { value: "observer", label: "ResizeObserver", description: "Measure container and pass dynamic size to VoltBoard" },
];

export function AdminTestBoard() {
  const measureRef = useRef<HTMLDivElement>(null);
  const [sizingMode, setSizingMode] = useState<SizingMode>("observer");
  const [fixedSize, setFixedSize] = useState(584);
  const [measuredSize, setMeasuredSize] = useState(400);
  const [simulateRiddleLayout, setSimulateRiddleLayout] = useState(true);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (sizingMode === "fixed" || !measureRef.current) return;

    const el = measureRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const size = Math.floor(Math.min(entry.contentRect.width, entry.contentRect.height));
      if (size > 0) setMeasuredSize(size);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [sizingMode, simulateRiddleLayout]);

  const boardSize = sizingMode === "fixed" ? fixedSize : measuredSize;

  const noopCheck = useCallback(() => true, []);
  const noopMove = useCallback(() => {}, []);
  const noopNext = useCallback(() => undefined, []);

  const board = (
    <VoltBoard
      sourceId="admin-test-board"
      initialFen={START_FEN}
      size={boardSize}
      onCheckMove={noopCheck}
      onSuccessMovePlayed={noopMove}
      onNextMoveRequest={noopNext}
    />
  );

  const boardArea =
    sizingMode === "wrapper" ? (
      <div ref={measureRef} className="board-wrapper">
        {board}
      </div>
    ) : sizingMode === "observer" ? (
      <div ref={measureRef} className="aspect-square w-full max-w-full">
        {board}
      </div>
    ) : (
      board
    );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Sizing mode</Label>
            <div className="flex flex-wrap gap-2">
              {SIZING_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setSizingMode(mode.value)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    sizingMode === mode.value
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              {SIZING_MODES.find((m) => m.value === sizingMode)?.description}
            </p>
          </div>

          {sizingMode === "fixed" && (
            <div className="space-y-2">
              <Label htmlFor="fixed-size">Board size: {fixedSize}px</Label>
              <input
                id="fixed-size"
                type="range"
                min={280}
                max={800}
                step={4}
                value={fixedSize}
                onChange={(e) => setFixedSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Switch
              id="riddle-layout"
              checked={simulateRiddleLayout}
              onCheckedChange={setSimulateRiddleLayout}
            />
            <Label htmlFor="riddle-layout">Simulate riddle layout (board + side panel)</Label>
          </div>

          <div className="text-muted-foreground grid gap-1 font-mono text-xs sm:grid-cols-3">
            <span>Viewport: {viewport.width} × {viewport.height}</span>
            <span>Board size: {boardSize}px</span>
            <span>Mode: {sizingMode}</span>
          </div>
        </CardContent>
      </Card>

      <div
        className={
          simulateRiddleLayout
            ? "flex flex-col gap-4 lg:flex-row"
            : "mx-auto max-w-2xl"
        }
      >
        <div
          className={
            simulateRiddleLayout
              ? "relative w-full min-w-0 rounded-2xl border-5 border-white/80 lg:w-auto lg:shrink-0"
              : "w-full"
          }
        >
          {boardArea}
        </div>

        {simulateRiddleLayout && (
          <div className="bg-card flex min-h-[200px] min-w-0 flex-1 flex-col gap-4 rounded-xl p-4">
            <p className="text-center text-lg font-bold">White to Play</p>
            <p className="text-muted-foreground text-sm">
              Side panel placeholder — resize the browser to test how the board behaves next to this
              column on lg+ breakpoints.
            </p>
            <div className="bg-muted mt-auto h-10 rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}
