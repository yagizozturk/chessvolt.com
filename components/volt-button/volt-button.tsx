import { type VariantProps, cva } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const voltButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[9px] font-bold whitespace-nowrap transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-[3px] focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-[5px] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
  {
    variants: {
      variant: {
        gold: "bg-[#ffd04b] text-[#2c1a58] shadow-[0_4px_0_#dca527] hover:bg-[#ffdc70] active:shadow-[0_1px_0_#dca527] focus-visible:outline-[#ffd04b]",
        purple:
          "bg-[#4522b4] text-white shadow-[0_4px_0_#2c1578] hover:bg-[#5530c6] active:shadow-[0_1px_0_#2c1578] focus-visible:outline-[#c6a8ff]",
        white:
          "bg-white text-[#2c1a58] shadow-[0_4px_0_#c9b8ea] hover:bg-[#fffaf0] active:shadow-[0_1px_0_#c9b8ea] focus-visible:outline-white",
        green:
          "bg-[#8fce5a] text-[#1c3210] shadow-[0_4px_0_#62943a] hover:bg-[#a4d674] active:shadow-[0_1px_0_#62943a] focus-visible:outline-[#8fce5a]",
      },
      size: {
        sm: "min-h-10 gap-2.5 px-4 py-2 text-xs [&_svg]:size-4",
        md: "min-h-[54px] gap-8 px-6 py-4 text-sm [&_svg]:size-5",
        lg: "min-h-16 gap-10 px-8 py-5 text-base [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  },
);

type VoltButtonProps = {
  href: string;
  label?: string;
  className?: string;
} & VariantProps<typeof voltButtonVariants>;

function VoltButton({ href, label = "Start Training", variant, size, className }: VoltButtonProps) {
  return (
    <Link href={href} className={cn(voltButtonVariants({ variant, size }), className)}>
      {label}
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}

export { VoltButton, voltButtonVariants };
