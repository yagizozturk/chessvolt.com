"use client";

import { useMemo, useState } from "react";

import { CodeViewer } from "@/app/(admin)/admin/storybook/components/code-viewer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const setTypeCode = `// JS:  Set<string>
// C#:  HashSet<string>`;

const setBasicsCode = `const selectedValues = ["tactics", "openings", "tactics"];
const selectedValueSet = new Set(selectedValues);
// Set { "tactics", "openings" } — duplicates removed

selectedValueSet.has("tactics");   // true  — fast lookup
selectedValueSet.has("endgames");  // false

[...selectedValueSet];             // back to string[]`;

const setExampleCode = `const selectedValueSet = new Set(selectedValues);

options.map((option) => (
  <OnboardingOptionCard
    selected={selectedValueSet.has(option.value)}
  />
));`;

const OPTIONS = [
  { value: "openings", label: "Openings" },
  { value: "tactics", label: "Tactics" },
  { value: "endgames", label: "Endgames" },
  { value: "strategy", label: "Strategy" },
] as const;

function SetDemo() {
  const [selectedValues, setSelectedValues] = useState<string[]>(["tactics"]);

  const selectedValueSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  function toggleOption(value: string) {
    setSelectedValues((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return [...next];
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const isSelected = selectedValueSet.has(option.value);

          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={() => toggleOption(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">selectedValues (array)</p>
          <pre className="bg-muted overflow-x-auto rounded-md border p-3 text-xs">
            {JSON.stringify(selectedValues, null, 2)}
          </pre>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            new Set(selectedValues)
          </p>
          <pre className="bg-muted overflow-x-auto rounded-md border p-3 text-xs">
            {JSON.stringify([...selectedValueSet], null, 2)}
          </pre>
        </div>
      </div>

      <p className="text-muted-foreground text-sm">
        Each card checks membership with{" "}
        <code className="bg-muted rounded px-1 py-0.5 text-xs">selectedValueSet.has(option.value)</code> instead of{" "}
        <code className="bg-muted rounded px-1 py-0.5 text-xs">selectedValues.includes(option.value)</code>.
      </p>
    </div>
  );
}

export default function SetPage() {
  return (
    <section id="set" className="space-y-6">
      <div>
        <h3 className="text-foreground text-xl font-semibold tracking-tight">JavaScript — Set</h3>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed">
          A <code className="bg-muted rounded px-1 py-0.5 text-xs">Set</code> stores unique values and answers
          &quot;is this value in the collection?&quot; quickly with{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">.has(value)</code>. In C#, the closest match is{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">HashSet&lt;string&gt;</code>.
        </p>
        <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong className="text-foreground font-medium">Uniqueness</strong> — adding the same value twice stores
            it once.
          </li>
          <li>
            <strong className="text-foreground font-medium">Fast lookup</strong> —{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">.has()</code> is typically O(1), while{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">array.includes()</code> scans the whole array each
            time.
          </li>
          <li>
            <strong className="text-foreground font-medium">When to use</strong> — many membership checks against the
            same list (e.g. marking which onboarding options are selected).
          </li>
          <li>
            State is still kept as an array when order matters or you need to map/filter; build a{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">Set</code> from that array at render time for
            lookups.
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Type — JavaScript vs C#</p>
        <CodeViewer code={setTypeCode} />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Create, check, convert back</p>
        <CodeViewer code={setBasicsCode} />
      </div>

      <div className="bg-muted/40 flex flex-col gap-3 rounded-md border p-4">
        <p className="text-sm font-medium">
          <span className="text-muted-foreground">Live example:</span> selected option values
        </p>

        <SetDemo />

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">
            In{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              features/onboarding-option/components/onboarding-option-list.tsx
            </code>
            , we receive <code className="bg-muted rounded px-1 py-0.5 text-xs">selectedValues</code> as a{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">string[]</code>, convert once to a Set, then call{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">.has(option.value)</code> for each card.
          </p>
          <CodeViewer code={setExampleCode} />
        </div>
      </div>
    </section>
  );
}
