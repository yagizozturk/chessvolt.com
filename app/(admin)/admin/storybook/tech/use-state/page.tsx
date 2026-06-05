"use client";

import { useState } from "react";

import { CodeViewer } from "@/app/(admin)/admin/storybook/components/code-viewer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const useStateExampleCode = `const [count, setCount] = useState(0);

setCount(count + 1);           // direct
setCount((prev) => prev + 1);  // safer when prev matters`;

function CounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={() => setCount((prev) => prev - 1)}>
        -
      </Button>
      <span className="min-w-8 text-center font-medium">{count}</span>
      <Button onClick={() => setCount((prev) => prev + 1)}>+</Button>
    </div>
  );
}

export default function UseStatePage() {
  return (
    <section id="use-state" className="space-y-4">
      <div>
        <h3 className="text-foreground text-xl font-semibold tracking-tight">React — useState</h3>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed">
          <code className="bg-muted rounded px-1 py-0.5 text-xs">useState</code> stores local component state. Calling
          the setter triggers a re-render with the new value. Pass an initial value (or a lazy initializer function) as
          the only argument.
        </p>
        <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>
            <code className="bg-muted rounded px-1 py-0.5 text-xs">const [value, setValue] = useState(initial)</code> —
            returns the current state and an updater.
          </li>
          <li>
            Prefer the functional updater{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">setValue((prev) =&gt; next)</code> when the next
            state depends on the previous one.
          </li>
          <li>State updates are asynchronous; React batches multiple setters in the same event.</li>
        </ul>
      </div>

      <div className="bg-muted/40 flex flex-col gap-3 rounded-md border p-4">
        <p className="text-sm font-medium">
          <span className="text-muted-foreground">Live example:</span> Counter
        </p>

        <div className="flex items-center">
          <CounterDemo />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">
            Click the buttons to increment or decrement the count. The number in the middle is driven by{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">useState(0)</code>.
          </p>
          <CodeViewer code={useStateExampleCode} />
        </div>
      </div>
    </section>
  );
}
