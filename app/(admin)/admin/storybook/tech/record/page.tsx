"use client";

import { useState } from "react";

import { CodeViewer } from "@/app/(admin)/admin/storybook/components/code-viewer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const recordTypeCode = `// TS:  Record<string, string[]>
// C#:  Dictionary<string, List<string>>`;

const recordBasicsCode = `const answers: Record<string, string[]> = {};

answers["q1"] = ["a", "b"];        // write
const ids = answers["q2"] ?? [];   // read (default if missing)`;

const recordExampleCode = `const [answers, setAnswers] = useState<Record<string, string[]>>({});

setAnswers((prev) => ({
  ...prev,
  [questionId]: [...(prev[questionId] ?? []), optionId],
}));

const selected = answers[questionId] ?? [];`;

const QUESTIONS = [
  {
    id: "goals",
    label: "What do you want to improve?",
    options: [
      { id: "openings", label: "Openings" },
      { id: "tactics", label: "Tactics" },
      { id: "endgames", label: "Endgames" },
    ],
  },
] as const;

function RecordDemo() {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  function toggleOption(questionId: string, optionId: string) {
    setAnswers((prev) => {
      const currentIds = prev[questionId] ?? [];
      const nextIds = currentIds.includes(optionId)
        ? currentIds.filter((id) => id !== optionId)
        : [...currentIds, optionId];

      return { ...prev, [questionId]: nextIds };
    });
  }

  return (
    <div className="space-y-4">
      {QUESTIONS.map((question) => {
        const selectedIds = answers[question.id] ?? [];

        return (
          <div key={question.id} className="space-y-2">
            <p className="text-sm font-medium">{question.label}</p>
            <div className="flex flex-wrap gap-2">
              {question.options.map((option) => {
                const isSelected = selectedIds.includes(option.id);

                return (
                  <Button
                    key={option.id}
                    type="button"
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => toggleOption(question.id, option.id)}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}

      <pre className="bg-muted overflow-x-auto rounded-md border p-3 text-xs">
        {JSON.stringify(answers, null, 2)}
      </pre>
    </div>
  );
}

export default function RecordPage() {
  return (
    <section id="record" className="space-y-6">
      <div>
        <h3 className="text-foreground text-xl font-semibold tracking-tight">
          TypeScript — Record&lt;string, string[]&gt;
        </h3>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed">
          <code className="bg-muted rounded px-1 py-0.5 text-xs">Record&lt;Key, Value&gt;</code> is TypeScript&apos;s
          built-in map type: every key maps to one value of a fixed shape.{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">Record&lt;string, string[]&gt;</code> means
          &quot;string keys, each holding an array of strings&quot; — the same idea as a C#{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">Dictionary&lt;string, List&lt;string&gt;&gt;</code>.
        </p>
        <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong className="text-foreground font-medium">Key</strong> — the lookup id (e.g. a question id).
          </li>
          <li>
            <strong className="text-foreground font-medium">Value</strong> — the data stored under that key (e.g.
            selected option ids).
          </li>
          <li>
            At runtime it is a plain JavaScript object <code className="bg-muted rounded px-1 py-0.5 text-xs">{"{}"}</code>
            , not a separate class like <code className="bg-muted rounded px-1 py-0.5 text-xs">Dictionary&lt;,&gt;</code> in
            C#.
          </li>
          <li>
            Use <code className="bg-muted rounded px-1 py-0.5 text-xs">?? []</code> when reading a key that may not
            exist yet — same as checking <code className="bg-muted rounded px-1 py-0.5 text-xs">TryGetValue</code> or
            defaulting to an empty list in C#.
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Type definition — TypeScript vs C#</p>
        <CodeViewer code={recordTypeCode} />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Read and write</p>
        <CodeViewer code={recordBasicsCode} />
      </div>

      <div className="bg-muted/40 flex flex-col gap-3 rounded-md border p-4">
        <p className="text-sm font-medium">
          <span className="text-muted-foreground">Live example:</span> onboarding-style answers
        </p>

        <RecordDemo />

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">
            Each question id is a dictionary key; the selected option ids are stored as a{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">string[]</code>. The JSON preview is the live{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">Record&lt;string, string[]&gt;</code>. We use the
            same pattern in{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">features/onboarding/components/onboarding-form.tsx</code>
            .
          </p>
          <CodeViewer code={recordExampleCode} />
        </div>
      </div>
    </section>
  );
}
