import {
  SkillLevel,
  SKILL_LEVEL_MAP,
} from "@/lib/shared/types/game-difficulty";

export interface EngineConfig {
  skillLevel?: SkillLevel | number;
  onMessage?: (line: string) => void;
  onReady?: () => void;
}

export function createEngine(config: EngineConfig = {}): Worker {
  const { skillLevel, onMessage, onReady } = config;
  const worker = new Worker("/stockfish.js");

  worker.postMessage("uci");

  // Converts Beginner skill level to 1 for Stockfish.
  if (skillLevel !== undefined) {
    const levelValue =
      typeof skillLevel === "number"
        ? skillLevel
        : SKILL_LEVEL_MAP[skillLevel as SkillLevel];

    if (levelValue !== undefined) {
      worker.postMessage(`setoption name Skill Level value ${levelValue}`);
    }
  }

  worker.postMessage("isready");

  if (onMessage || onReady) {
    worker.onmessage = (e) => {
      const line = String(e.data);

      if (line === "readyok" && onReady) {
        onReady();
        worker.postMessage("ucinewgame");
      }

      if (onMessage) {
        onMessage(line);
      }
    };
  }

  return worker;
}
