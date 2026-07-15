"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${color}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="relative text-center group">
      <div className="relative z-10 w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30">
        <span className="text-white text-xl font-bold">{number}</span>
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo className="group-hover:scale-105 group-hover:shadow-md transition-transform duration-300" />
            <span className="font-semibold text-lg text-foreground">CloseCycle</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none dark:from-blue-900/10" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 via-blue-100/10 to-transparent rounded-full blur-3xl pointer-events-none dark:from-primary/10 dark:via-blue-900/10" />
        <div className="absolute top-40 right-10 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full blur-2xl pointer-events-none dark:from-blue-900/20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-sm text-primary font-medium mb-8 dark:bg-blue-900/20 dark:border-blue-900/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            Built for solo bookkeepers
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight max-w-4xl mx-auto">
            Your monthly close cycle,<br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
              at a glance.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop chasing clients through email and spreadsheets. CloseCycle turns your monthly close workflow into
            a visual grid&mdash;one click to see who&apos;s on track, who&apos;s missing docs, and what needs attention.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-lg font-medium transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Start Free Trial
            </Link>
            <Link
              href="#how-it-works"
              className="border border-border text-foreground px-8 py-3.5 rounded-xl text-lg font-medium transition-all duration-200 hover:bg-accent hover:border-border"
            >
              How It Works
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
            {[
              { value: "14", label: "Day free trial" },
              { value: "$29", label: "Per month" },
              { value: "20", label: "Max clients" },
            ].map((stat, i) => (
              <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 100 + 300}ms` }}>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
              Everything you need to close the books
            </h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16 text-lg">
              No more spreadsheets. No more chasing clients. Just a clean, visual workflow.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={0}>
              <FeatureCard
                icon={<svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                title="Visual Close Grid"
                desc="See every client's monthly close status — Not Started, Awaiting Docs, Complete — all in one clean grid."
                color="bg-primary/10"
              />
            </Reveal>
            <Reveal delay={100}>
              <FeatureCard
                icon={<svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                title="Auto Reminders"
                desc="Set it once. CloseCycle automatically emails your clients when documents are due."
                color="bg-emerald-50 dark:bg-emerald-900/20"
              />
            </Reveal>
            <Reveal delay={200}>
              <FeatureCard
                icon={<svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                title="Client Portal"
                desc="Clients get a simple, no-login link to upload documents. No passwords or portals to learn."
                color="bg-violet-50 dark:bg-violet-900/20"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
              Four steps to a closed month
            </h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16 text-lg">
              From adding clients to closing the books — here&apos;s how it works.
            </p>
          </Reveal>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
            {[
              { number: "1", title: "Add Clients", desc: "Enter your clients and what documents you need each month." },
              { number: "2", title: "Set Reminders", desc: "Choose when reminders go out. We handle the emails." },
              { number: "3", title: "Track Status", desc: "See every client's month-end status in one visual grid." },
              { number: "4", title: "Close Fast", desc: "Mark complete. Archive. Move to next month. Repeat." },
            ].map((item, i) => (
              <Reveal key={item.number} delay={i * 100}>
                <StepCard number={item.number} title={item.title} desc={item.desc} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-4xl mx-auto bg-card rounded-3xl border border-border p-8 sm:p-12 shadow-sm">
              <div className="text-center mb-10">
                <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Pricing</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-3">
                  Simple, transparent pricing
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  No annual contracts. No hidden fees. Just one straightforward plan for solo bookkeepers.
                </p>
              </div>

              <div className="bg-gradient-to-br from-muted/50 to-card rounded-2xl border border-border p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-foreground">$29</span>
                      <span className="text-muted-foreground text-lg">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">14-day free trial &mdash; no credit card required</p>
                  </div>
                  <div className="flex-1 w-full">
                    <ul className="space-y-3">
                      {[
                        "Up to 20 clients",
                        "Unlimited document templates",
                        "Automated email reminders",
                        "Client portal for document upload",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Unlike competitors charging <span className="line-through text-muted-foreground/50">$228&ndash;$804/year</span> upfront.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-flex bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.97] shrink-0"
                  >
                    Start Your Free Trial
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Logo className="w-8 h-8" />
              <span className="text-sm font-medium text-foreground">CloseCycle</span>
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} CloseCycle. Built for solo bookkeepers.
            </p>
          </div>
        </div></footer>
    </div>
  );
}