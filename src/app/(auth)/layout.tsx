"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none dark:from-blue-900/10" />
      <header className="flex w-full max-w-sm items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="w-9 h-9" />
          <span className="font-semibold text-lg text-foreground">CloseCycle</span>
        </Link>
        <ThemeToggle />
      </header>
      {children}
    </div>
  );
}