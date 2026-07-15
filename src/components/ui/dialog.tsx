"use client";

import { cn } from "@/lib/utils";
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) throw new Error("Dialog components must be used within a Dialog");
  return context;
}

interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

function DialogTrigger({ children, asChild }: DialogTriggerProps) {
  const { onOpenChange } = useDialog();
  if (asChild) {
    return <span onClick={() => onOpenChange(true)}>{children}</span>;
  }
  return (
    <button type="button" onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
}

interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, showClose = true, ...props }, ref) => {
    const { open, onOpenChange } = useDialog();
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={ref}
          className={cn(
            "fixed z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg",
            className
          )}
          {...props}
        >
          {showClose && (
            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => onOpenChange(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          )}
          {children}
        </div>
      </div>
    );
  }
);
DialogContent.displayName = "DialogContent";

const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
        {...props}
      />
    );
  }
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
      />
    );
  }
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
DialogDescription.displayName = "DialogDescription";

const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
        {...props}
      />
    );
  }
);
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
