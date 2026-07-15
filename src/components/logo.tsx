import { forwardRef, SVGProps } from "react";

export const Logo = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ className = "w-9 h-9", ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
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