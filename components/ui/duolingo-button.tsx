import { cn } from "@/lib/utils";
import * as React from "react";

import "@/assets/duolingo-button.css";

type DuolingoButtonProps = React.ComponentProps<"button">;

const DuolingoButton = React.forwardRef<HTMLButtonElement, DuolingoButtonProps>(
  ({ className, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn("duolingo-button", className)}
        {...props}
      />
    );
  },
);

DuolingoButton.displayName = "DuolingoButton";

export { DuolingoButton };
