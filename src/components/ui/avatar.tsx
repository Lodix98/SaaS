import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full bg-muted overflow-hidden",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" />
        ) : (
          <span className="font-medium text-muted-foreground">
            {getInitials(fallback)}
          </span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
