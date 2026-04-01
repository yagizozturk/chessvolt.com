"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";
import { Check, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "chessvolt-test-tasks-v1";

type TaskStatus = "pending" | "completed";

/** 5 = en yüksek önem (liste en üstünde), 1 = en düşük */
type Task = {
  id: string;
  text: string;
  importance: 1 | 2 | 3 | 4 | 5;
  status: TaskStatus;
};

const IMPORTANCE_OPTIONS: { value: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { value: 5, label: "P1 — Kritik" },
  { value: 4, label: "P2 — Yüksek" },
  { value: 3, label: "P3 — Orta" },
  { value: 2, label: "P4 — Düşük" },
  { value: 1, label: "P5 — Bekleyebilir" },
];

/** P1 (5) → P5 (1): her seviye için ayrı renk (açık / koyu tema) */
function importanceBadgeClassName(level: 1 | 2 | 3 | 4 | 5): string {
  switch (level) {
    case 5: // P1 — Kritik
      return "border-red-500/70 bg-red-600/15 text-red-950 dark:border-red-400/55 dark:bg-red-950/45 dark:text-red-100";
    case 4: // P2 — Yüksek
      return "border-orange-500/65 bg-orange-500/15 text-orange-950 dark:border-orange-400/50 dark:bg-orange-950/40 dark:text-orange-100";
    case 3: // P3 — Orta
      return "border-amber-500/60 bg-amber-400/18 text-amber-950 dark:border-amber-400/45 dark:bg-amber-950/35 dark:text-amber-100";
    case 2: // P4 — Düşük
      return "border-emerald-500/55 bg-emerald-500/12 text-emerald-950 dark:border-emerald-400/45 dark:bg-emerald-950/35 dark:text-emerald-100";
    case 1: // P5 — Bekleyebilir
      return "border-violet-500/50 bg-violet-500/10 text-violet-950 dark:border-violet-400/40 dark:bg-violet-950/45 dark:text-violet-100";
  }
}

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      if (a.status === "completed") return 1;
      if (b.status === "completed") return -1;
    }
    if (b.importance !== a.importance) return b.importance - a.importance;
    return a.id.localeCompare(b.id);
  });
}

function parseStoredTasks(raw: string): Task[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  const out: Task[] = [];
  for (const item of parsed) {
    if (typeof item !== "object" || item === null) continue;
    const t = item as Record<string, unknown>;
    if (
      typeof t.id !== "string" ||
      typeof t.text !== "string" ||
      typeof t.importance !== "number" ||
      t.importance < 1 ||
      t.importance > 5
    ) {
      continue;
    }
    const imp = Math.round(t.importance) as 1 | 2 | 3 | 4 | 5;
    const status: TaskStatus =
      t.status === "completed" ? "completed" : "pending";
    out.push({ id: t.id, text: t.text, importance: imp, status });
  }
  return out;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newText, setNewText] = useState("");
  const [newImportance, setNewImportance] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        setTasks([]);
      } else {
        setTasks(parseStoredTasks(raw));
      }
    } catch {
      setTasks([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const sorted = useMemo(() => sortTasks(tasks), [tasks]);

  const addTask = useCallback(() => {
    const text = newText.trim();
    if (!text) return;
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        importance: newImportance,
        status: "pending",
      },
    ]);
    setNewText("");
  }, [newText, newImportance]);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateText = useCallback((id: string, text: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "completed" ? "pending" : "completed",
            }
          : t,
      ),
    );
  }, []);

  return (
    <div className="container mx-auto max-w-2xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Görevler</CardTitle>
          <CardDescription>
            Önce bekleyenler, önem (P1→P5) yüksekten düşüğe; tamamlananlar
            altta. Liste tarayıcıda saklanır.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[min(60vh,480px)] pr-3">
            <ul className="space-y-4">
              {sorted.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  Henüz görev yok. Aşağıdan ekleyebilirsin.
                </p>
              ) : (
                sorted.map((task) => (
                  <li key={task.id}>
                    <div
                      className={cn(
                        "flex flex-col gap-3 sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center",
                        task.status === "completed" && "opacity-75",
                      )}
                    >
                      <div className="flex gap-3 sm:contents">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className={cn(
                            "size-9 shrink-0",
                            task.status === "completed" &&
                              "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-600/90 dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-600/90",
                          )}
                          onClick={() => toggleStatus(task.id)}
                          aria-label={
                            task.status === "completed"
                              ? "Bekliyor olarak işaretle"
                              : "Tamamlandı olarak işaretle"
                          }
                          title={
                            task.status === "completed"
                              ? "Tamamlandı — tıkla: işareti kaldır"
                              : "Tamamlandı olarak işaretle"
                          }
                        >
                          <Check
                            className={cn(
                              "size-4",
                              task.status !== "completed" && "opacity-30",
                            )}
                          />
                        </Button>
                        <Input
                          value={task.text}
                          onChange={(e) => updateText(task.id, e.target.value)}
                          className={cn(
                            "min-w-0 flex-1 font-medium",
                            task.status === "completed" &&
                              "text-muted-foreground line-through",
                          )}
                          placeholder="Görev metni"
                        />
                      </div>
                      <div className="flex shrink-0 items-center justify-end gap-2 sm:col-start-3 sm:row-start-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0",
                            importanceBadgeClassName(task.importance),
                          )}
                        >
                          {
                            IMPORTANCE_OPTIONS.find(
                              (o) => o.value === task.importance,
                            )?.label
                          }
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive size-9"
                          onClick={() => removeTask(task.id)}
                          aria-label="Sil"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </ScrollArea>
        </CardContent>
        <Separator />
        <CardFooter className="flex-col items-stretch gap-4 pt-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Yeni görev</FieldLabel>
              <Input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTask();
                  }
                }}
                placeholder="Ne yapılacak?"
              />
            </Field>
            <Field>
              <Label htmlFor="task-importance" className="text-sm font-medium">
                Önem seviyesi
              </Label>
              <select
                id="task-importance"
                value={newImportance}
                onChange={(e) =>
                  setNewImportance(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
                }
                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              >
                {IMPORTANCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={addTask}
            >
              <Plus className="size-4" />
              Ekle
            </Button>
          </FieldGroup>
        </CardFooter>
      </Card>
    </div>
  );
}
