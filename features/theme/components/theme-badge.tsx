import { Tags } from "lucide-react";
import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import type { Theme } from "@/features/theme/types/theme";

type ThemeBadgeProps = {
  theme: Pick<Theme, "title" | "slug">;
  showIcon?: boolean;
  variant?: ComponentProps<typeof Badge>["variant"];
};

export function ThemeBadge({ theme, showIcon = false, variant = "secondary" }: ThemeBadgeProps) {
  return (
    <Badge variant={variant} className="font-normal">
      {showIcon ? <Tags className="text-primary" data-icon="inline-start" /> : null}
      {theme.title}
    </Badge>
  );
}
