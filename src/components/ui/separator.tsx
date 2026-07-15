import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

const Separator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("h-px w-full bg-border", className)}
        role="separator"
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator };
