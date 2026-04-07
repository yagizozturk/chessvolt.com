import type { LucideIcon } from "lucide-react";
import * as React from "react";

type StatsViewerColor = "mint" | "blue" | "purple" | "amber";

type StatsViewerProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number | string;
  label: string;
  icon: LucideIcon;
  color?: StatsViewerColor;
};

export function StatsViewer({
  value,
  label,
  icon: Icon,
  color = "mint",
  className = "",
  ...props
}: StatsViewerProps) {
  const { style, ...restProps } = props;

  const colorVariants: Record<
    StatsViewerColor,
    {
      rgb: string;
      background: string;
      border: string;
      shadow: string;
      text: string;
      label: string;
    }
  > = {
    mint: {
      rgb: "88, 204, 187",
      background: "rgba(88, 204, 187, 0.08)",
      border: "rgba(88, 204, 187, 0.2)",
      shadow: "rgba(88, 204, 187, 0.15) 0px 4px 0px 0px",
      text: "rgb(88, 204, 187)",
      label: "rgba(88, 204, 187, 0.8)",
    },
    blue: {
      rgb: "79, 142, 232",
      background: "rgba(79, 142, 232, 0.08)",
      border: "rgba(79, 142, 232, 0.2)",
      shadow: "rgba(79, 142, 232, 0.15) 0px 4px 0px 0px",
      text: "rgb(79, 142, 232)",
      label: "rgba(79, 142, 232, 0.8)",
    },
    purple: {
      rgb: "139, 92, 246",
      background: "rgba(139, 92, 246, 0.082)",
      border: "rgba(139, 92, 246, 0.2)",
      shadow: "rgba(139, 92, 246, 0.15) 0px 4px 0px 0px",
      text: "rgb(139, 92, 246)",
      label: "rgba(139, 92, 246, 0.8)",
    },
    amber: {
      rgb: "217, 119, 6",
      background: "rgba(217, 119, 6, 0.08)",
      border: "rgba(217, 119, 6, 0.2)",
      shadow: "rgba(217, 119, 6, 0.15) 0px 4px 0px 0px",
      text: "rgb(217, 119, 6)",
      label: "rgba(217, 119, 6, 0.8)",
    },
  };

  const variant = colorVariants[color];

  return (
    <div
      className={`group relative flex min-w-[100px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 px-4 py-3 transition-all hover:-translate-y-1 ${className}`}
      style={{
        backgroundColor: variant.background,
        borderColor: variant.border,
        boxShadow: variant.shadow,
        ...style,
      }}
      {...restProps}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ backgroundColor: `rgb(${variant.rgb})` }}
      />

      <div
        className="relative z-10 mb-1 font-fredoka text-xl font-black leading-none"
        style={{ color: variant.text }}
      >
        {value}
      </div>

      <div
        className="relative z-10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
        style={{ color: variant.label }}
      >
        <span className="text-current opacity-75 transition-transform group-hover:scale-110">
          <Icon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span>
          {label}
        </span>
      </div>
    </div>
  );
}
