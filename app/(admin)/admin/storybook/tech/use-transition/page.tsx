"use client";

import { useState, useTransition } from "react";

import { CodeViewer } from "@/app/(admin)/admin/storybook/components/code-viewer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

const useTransitionBasicsCode = `const [isPending, startTransition] = useTransition();

startTransition(() => {
  setStepIndex((prev) => prev + 1); // non-urgent UI update
});`;

const useTransitionAsyncCode = `startTransition(async () => {
  const result = await completeOnboardingAction(answers);
  if (!result.success) {
    setError(result.error);
    return;
  }
  router.refresh();
  router.push(POST_ONBOARDING_URL);
});

// isPending → true while the async work runs
// disable buttons, show "Saving...", block option clicks`;

function TransitionDemo() {
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function handleSave() {
    setSavedAt(null);
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSavedAt(new Date().toLocaleTimeString());
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Button type="button" variant="volt" onClick={handleSave} disabled={isPending}>
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" />
            Saving...
          </>
        ) : (
          "Finish onboarding"
        )}
      </Button>
      <p className="text-muted-foreground text-sm">
        {isPending
          ? "isPending is true — button disabled, spinner shown."
          : savedAt
            ? `Saved at ${savedAt}. Click again to replay the pending state.`
            : "Click to simulate a slow server save (1.5s)."}
      </p>
    </div>
  );
}

export default function UseTransitionPage() {
  return (
    <section id="use-transition" className="space-y-6">
      <div>
        <h3 className="text-foreground text-xl font-semibold tracking-tight">React — useTransition</h3>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed">
          <code className="bg-muted rounded px-1 py-0.5 text-xs">useTransition</code> marks certain updates as{" "}
          <strong className="text-foreground font-medium">non-urgent transitions</strong>. React can keep the current
          UI responsive while those updates finish. The hook returns a pending flag and a{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">startTransition</code> wrapper.
        </p>
        <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>
            <code className="bg-muted rounded px-1 py-0.5 text-xs">isPending</code> —{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">true</code> while the transition is running. Use it
            for loading labels, spinners, and disabling controls.
          </li>
          <li>
            <code className="bg-muted rounded px-1 py-0.5 text-xs">startTransition(fn)</code> — run state updates (or
            async work in React 19) inside this callback so React treats them as a transition.
          </li>
          <li>
            Good for step changes, form submits, and server actions where you want immediate feedback without blocking
            urgent UI like typing.
          </li>
          <li>
            Not a replacement for error handling — you still handle failed requests inside the callback (e.g.{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">setError(result.error)</code>).
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Sync transition — e.g. moving to the next step</p>
        <CodeViewer code={useTransitionBasicsCode} />
      </div>

      <div className="bg-muted/40 flex flex-col gap-3 rounded-md border p-4">
        <p className="text-sm font-medium">
          <span className="text-muted-foreground">Live example:</span> async save with pending UI
        </p>

        <TransitionDemo />

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">
            In{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              features/onboarding/components/onboarding-form.tsx
            </code>
            , finishing onboarding wraps{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">completeOnboardingAction</code> in{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">startTransition</code>. While{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">isPending</code> is true, options and buttons are
            disabled and the primary button shows &quot;Saving...&quot;.
          </p>
          <CodeViewer code={useTransitionAsyncCode} />
        </div>
      </div>
    </section>
  );
}
