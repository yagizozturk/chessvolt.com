import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const labelBadgeTemplates = {
  red: "border-red-600 bg-red-200 text-red-600",
  blue: "border-blue-600 bg-blue-100 text-blue-600",
  green: "border-green-600 bg-green-100 text-green-600",
  amber: "border-amber-600 bg-amber-100 text-amber-600",
  purple: "border-purple-600 bg-purple-100 text-purple-600",
} as const;

type LabelBadgeProps = {
  label: string;
  icon: LucideIcon;
  template?: keyof typeof labelBadgeTemplates;
};

export function LabelBadge({ label, icon: Icon, template = "red" }: LabelBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-xl border border-b-[4px] px-3 py-2",
        labelBadgeTemplates[template],
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="text-sm leading-none font-medium">{label}</span>
    </div>
  );
}
