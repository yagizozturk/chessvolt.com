import { Zap } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const sizeStyles = {
  default: { root: "gap-2 text-2xl", icon: "h-6 w-6" },
  lg: { root: "gap-3 text-4xl", icon: "h-10 w-10" },
  xl: { root: "gap-4 text-6xl", icon: "h-16 w-16" },
  hero: { root: "gap-5 text-8xl", icon: "h-20 w-20 sm:h-24 sm:w-24" },
} as const;

type ChessVoltLogoSize = keyof typeof sizeStyles;

type ChessVoltLogoProps = {
  size?: ChessVoltLogoSize;
  className?: string;
  href?: string;
  onNavigate?: () => void;
  variant?: "default" | "sheet";
};

export function ChessVoltLogo({
  size = "default",
  className,
  href,
  onNavigate,
  variant = "default",
}: ChessVoltLogoProps) {
  const styles = sizeStyles[size];
  const sheet = variant === "sheet";

  const content = (
    <>
      <Zap
        aria-hidden
        className={cn(
          "text-primary shrink-0",
          sheet ? "h-5 w-5" : "fill-primary",
          !sheet && styles.icon,
        )}
      />
      <span>ChessVolt</span>
    </>
  );

  const rootClassName = cn(
    "flex items-center font-bold tracking-tighter transition-opacity hover:opacity-90",
    sheet ? "gap-2 text-xl text-white" : cn("text-foreground", styles.root),
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={rootClassName}
        aria-label={sheet ? "ChessVolt - Go to home" : "ChessVolt - Home"}
      >
        {content}
      </Link>
    );
  }

  return <div className={rootClassName}>{content}</div>;
}
