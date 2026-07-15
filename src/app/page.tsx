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
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/20 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <div className="animate-fade-in-up text-center" style={{ animationDelay: `${delay}ms` }}>
      <div className="text-4xl font-bold text-foreground tracking-tight">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-semibold text-lg text-foreground tracking-tight">CloseCycle</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.4)] active:scale-[0.97]"
            >
              Start Free Trial
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="block text-sm text-muted-foreground hover:text-foreground py-2">
                Log in
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-medium tracking-wide uppercase mb-8">
                Built for solo bookkeepers
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] tracking-tight">
                Your monthly<br />
                <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                  close cycle.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Stop chasing clients. CloseCycle turns your monthly close workflow into a visual grid —
                one click to see who&apos;s on track, who&apos;s missing docs, and what needs attention.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-base font-medium transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="#how-it-works"
                  className="border border-border text-foreground px-8 py-3.5 rounded-full text-base font-medium transition-all duration-300 hover:bg-accent"
                >
                  See How It Works
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                <StatCard value="14" label="Day free trial" delay={500} />
                <StatCard value="$29" label="Per month" delay={600} />
                <StatCard value="20" label="Max clients" delay={700} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-20">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Features</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-6 tracking-tight">
                Everything you need to close the books
              </h2>
              <p className="text-muted-foreground mt-4 text-lg max-w-lg mx-auto">
                No more spreadsheets. No more chasing clients. Just a clean, visual workflow.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={0}>
              <FeatureCard
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                title="Visual Close Grid"
                desc="See every client's monthly close status — Not Started, Awaiting Docs, Complete — all in one clean grid."
              />
            </Reveal>
            <Reveal delay={100}>
              <FeatureCard
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                title="Auto Reminders"
                desc="Set it once. CloseCycle automatically emails your clients when documents are due."
              />
            </Reveal>
            <Reveal delay={200}>
              <FeatureCard
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                title="Client Portal"
                desc="Clients get a simple, no-login link to upload documents. No passwords or portals to learn."
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-32 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-20">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">How It Works</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-6 tracking-tight">
                Four steps to a closed month
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                From adding clients to closing the books.
              </p>
            </div>
          </Reveal>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
            {[
              { number: "01", title: "Add Clients", desc: "Enter your clients and what documents you need each month." },
              { number: "02", title: "Set Reminders", desc: "Choose when reminders go out. We handle the emails." },
              { number: "03", title: "Track Status", desc: "See every client's month-end status in one visual grid." },
              { number: "04", title: "Close Fast", desc: "Mark complete. Archive. Move to next month. Repeat." },
            ].map((item, i) => (
              <Reveal key={item.number} delay={i * 100}>
                <div className="relative text-center group">
                  <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-card border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]">
                    <span className="text-foreground text-lg font-bold">{item.number}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-20">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Pricing</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-6 tracking-tight">
                Simple, transparent pricing
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                No annual contracts. No hidden fees. Just one plan for solo bookkeepers.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-lg mx-auto">
              <div className="bg-card rounded-3xl border border-border p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-6xl font-bold text-foreground tracking-tight">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">14-day free trial &mdash; no credit card required</p>

                <ul className="space-y-4 mb-10">
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

                <Link
                  href="/signup"
                  className="block w-full text-center bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  Start Your Free Trial
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Unlike competitors charging $228&ndash;$804/year upfront
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="py-16 border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo className="w-7 h-7" />
              <span className="text-sm font-medium text-foreground">CloseCycle</span>
            </div>
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CloseCycle
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
