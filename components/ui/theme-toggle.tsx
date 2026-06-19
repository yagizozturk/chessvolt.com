"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Flips between light and dark on each call. Used by the sidebar Settings menu as a single
// "Change Color Mode" action — no submenu, no system option.
// Uses resolvedTheme (not theme) so the toggle works correctly even when the stored
// preference was previously "system".
export function useToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();

  return React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);
}

// Standalone icon button with a full theme picker dropdown (Light / Dark / System).
// Kept for other surfaces (e.g. navbar). The sidebar does NOT embed this component
// because nesting a dropdown inside the Settings submenu would be poor UX.
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
