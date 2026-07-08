// TODO: Refactor
"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export function ProfileThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <Field className="flex flex-row items-center justify-between gap-4">
      <div className="space-y-1">
        <FieldLabel className="mb-0">Dark mode</FieldLabel>
        <FieldDescription>Use a dark color scheme across the site.</FieldDescription>
      </div>
      <Switch
        checked={mounted ? isDark : false}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        disabled={!mounted}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />
    </Field>
  );
}
