import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-sm",
      muted: "text-muted-foreground text-sm",
      caption: "text-muted-foreground text-sm font-medium",
      subtitle: "text-muted-foreground text-base",
      pageTitle: "text-3xl font-bold tracking-tight",
      heading: "text-2xl font-bold tracking-tight",
      error: "text-destructive text-sm",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TextElement = "p" | "span" | "div" | "h1" | "h2" | "h3" | "label";

type TextProps<T extends TextElement = "p"> = {
  as?: T;
} & VariantProps<typeof textVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, "as">;

function Text<T extends TextElement = "p">({
  as,
  className,
  variant,
  ...props
}: TextProps<T>) {
  const Comp = (as ?? "p") as React.ElementType;

  return (
    <Comp
      data-slot="text"
      data-variant={variant}
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Text, textVariants };
