import { cn } from "@/lib/utils";
import * as React from "react";

import "@/assets/volt-button.css";

type VoltButtonProps = React.ComponentProps<"button">;

const VoltButton = React.forwardRef<HTMLButtonElement, VoltButtonProps>(
  ({ className, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn("volt-button", className)}
        {...props}
      />
    );
  },
);

VoltButton.displayName = "VoltButton";

export { VoltButton };
