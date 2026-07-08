// TODO: Refactor
import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import type { Theme } from "@/features/theme/types/theme";

type ThemeBadgeProps = {
  theme: Pick<Theme, "title" | "slug">;
  variant?: ComponentProps<typeof Badge>["variant"];
};

export function ThemeBadge({ theme, variant = "secondary" }: ThemeBadgeProps) {
  return (
    <Badge variant={variant} className="font-normal">
      {theme.title}
    </Badge>
  );
}
