"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
      <header className="flex w-full max-w-sm items-center justify-between mb-10 relative">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="w-8 h-8" />
          <span className="font-semibold text-lg text-foreground tracking-tight">CloseCycle</span>
        </Link>
        <ThemeToggle />
      </header>
      {children}
    </div>
  );
}