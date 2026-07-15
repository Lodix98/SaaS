import { forwardRef, SVGProps } from "react";
import { cn } from "@/lib/utils";

export const Logo = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("w-9 h-9", className)}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-primary" />
      <path
        d="M10 12h12M10 16h8M10 20h10"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);
Logo.displayName = "Logo";