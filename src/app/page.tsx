"use client";

import Link from "next/link";
import { useEffect, useRef, useState, ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

function cn(...c: (string | undefined | false | null)[]) { return c.filter(Boolean).join(" "); }

function useOnScreen(ref: React.RefObject<HTMLElement | null>, threshold = 0.1) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    o.observe(el);
    return () => o.disconnect();
  }, [ref, threshold]);
  return v;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useOnScreen(ref);
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)`,
      transitionDelay: `${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const [h, setH] = useState(false);
  const r = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mv = (e: MouseEvent) => {
      if (r.current) cancelAnimationFrame(r.current);
      r.current = requestAnimationFrame(() => {
        r.current = 0;
        const rect = el!.getBoundingClientRect();
        setT({ x: ((e.clientX - rect.left) / rect.width - 0.5) * 10, y: ((e.clientY - rect.top) / rect.height - 0.5) * -10 });
      });
    };
    const lv = () => { setH(false); setT({ x: 0, y: 0 }); };
    const ev = () => setH(true);
    el.addEventListener("mouseenter", ev);
    el.addEventListener("mousemove", mv);
    el.addEventListener("mouseleave", lv);
    return () => {
      el.removeEventListener("mouseenter", ev);
      el.removeEventListener("mousemove", mv);
      el.removeEventListener("mouseleave", lv);
      if (r.current) cancelAnimationFrame(r.current);
    };
  }, []);

  return (
    <div ref={ref} className={cn("will-change-transform", className)} style={{
      transformStyle: "preserve-3d",
      transform: h ? `perspective(1200px) rotateX(${t.y}deg) rotateY(${t.x}deg) scale3d(1.02,1.02,1.02)` : "perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)",
      transition: h ? "none" : "transform 0.5s ease",
    }}>
      {children}
    </div>
  );
}

function ProductCard({
  title, subtitle, description, links, gradient, index,
}: {
  title: string;
  subtitle: string;
  description: string;
  links: { label: string; href: string }[];
  gradient: string;
  index: number;
}) {
  return (
    <Reveal delay={index * 100}>
      <TiltCard>
        <div className="relative rounded-2xl overflow-hidden bg-card border border-border/40 min-h-[420px] sm:min-h-[480px] flex flex-col">
          <div className="absolute inset-0 opacity-[0.03]" style={{ background: gradient }} />
          <div className="relative z-10 p-8 sm:p-10 flex flex-col flex-1">
            <div className="mb-4">
              <span className="text-[11px] font-semibold tracking-[0.05em] text-muted-foreground/60 uppercase">{subtitle}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">{title}</h3>
            <p className="text-sm sm:text-base text-muted-foreground/70 mt-2 leading-relaxed max-w-xs">{description}</p>
            <div className="mt-auto pt-8 flex flex-wrap gap-x-5 gap-y-2">
              {links.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-primary hover:underline underline-offset-2 transition-all inline-flex items-center gap-1 group">
                  {link.label}
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">&#x2192;</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="relative mx-8 sm:mx-10 mb-8 sm:mb-10 rounded-xl overflow-hidden h-32 sm:h-36" style={{ background: `linear-gradient(135deg, ${gradient})` }}>
            <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-background/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

const NAV_LINKS = ["Features", "Gallery", "Pricing"];

const PRODUCTS = [
  {
    title: "Visual Grid",
    subtitle: "Dashboard",
    description: "See every client's monthly close status at a glance. One view replaces a dozen spreadsheets.",
    gradient: "rgba(59,130,246,0.3), rgba(99,102,241,0.1)",
    links: [{ label: "Learn more", href: "#" }, { label: "See it in action", href: "#" }],
  },
  {
    title: "Auto Reminders",
    subtitle: "Automation",
    description: "Set your cadence once. CloseCycle emails clients when documents are due, overdue, or missing.",
    gradient: "rgba(16,185,129,0.3), rgba(20,184,166,0.1)",
    links: [{ label: "Learn more", href: "#" }, { label: "View templates", href: "#" }],
  },
  {
    title: "Client Portal",
    subtitle: "Uploads",
    description: "A no-login link for clients to upload bank statements, receipts, and reports. No passwords needed.",
    gradient: "rgba(168,85,247,0.3), rgba(217,70,239,0.1)",
    links: [{ label: "Learn more", href: "#" }, { label: "Try the portal", href: "#" }],
  },
  {
    title: "Analytics",
    subtitle: "Insights",
    description: "Track your close rate, average time per client, and identify bottlenecks in your workflow.",
    gradient: "rgba(245,158,11,0.3), rgba(239,68,68,0.1)",
    links: [{ label: "Learn more", href: "#" }, { label: "View demo", href: "#" }],
  },
];

const FOOTER_LINKS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Gallery", "Integrations", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press", "Contact"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Help Center", "API Reference", "Community", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies", "Licenses"],
  },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-11 sm:h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo className="w-5 h-5" />
            <span className="text-sm font-semibold text-foreground tracking-tight hidden sm:inline">CloseCycle</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((l) => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors duration-200">
                {l}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <Link href="/signup" className="text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-medium transition-all duration-300 hover:bg-primary/90 active:scale-[0.97]">
              Get started
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1.5 -mr-1.5 text-foreground/70" aria-label="Menu">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-lg">
            <div className="px-5 py-3 space-y-2">
              {NAV_LINKS.map((l) => (
                <Link key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground/70 hover:text-foreground py-1.5">
                  {l}
                </Link>
              ))}
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground/70 hover:text-foreground py-1.5">
                Log in
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="pt-11 sm:pt-12">
        <div className="relative min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-background pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-20 pb-16 text-center">
            <Reveal>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold text-foreground tracking-[-0.03em] leading-[1.05]">
                CloseCycle
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-3 sm:mt-4 text-xl sm:text-2xl lg:text-3xl text-muted-foreground/70 font-light tracking-tight">
                Your monthly close cycle, <span className="text-foreground font-normal">simplified</span>.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground/50 max-w-md mx-auto leading-relaxed">
                One click to see who&apos;s on track, who&apos;s missing docs, and what needs attention.
              </p>
            </Reveal>

            <Reveal delay={450}>
              <div className="mt-8 sm:mt-10 flex items-center justify-center gap-5">
                <Link href="/signup" className="text-sm bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:bg-primary/90 active:scale-[0.97] inline-flex items-center gap-1.5 group">
                  Start Free Trial
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">&#x2192;</span>
                </Link>
                <Link href="#features" className="text-sm text-primary hover:underline underline-offset-2 transition-all">
                  Learn more &#x2192;
                </Link>
              </div>
            </Reveal>

            <Reveal delay={600}>
              <div className="mt-16 sm:mt-20 max-w-3xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-gradient-to-b from-card to-background p-1">
                  <div className="rounded-xl overflow-hidden bg-background/50 min-h-[240px] sm:min-h-[320px] flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Logo className="w-8 h-8" />
                      </div>
                      <p className="text-sm text-muted-foreground/50">CloseCycle Dashboard</p>
                      <div className="mt-4 grid grid-cols-3 gap-3 max-w-xs mx-auto">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-2 rounded-full bg-primary/20" style={{ width: `${50 + i * 20}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="text-center mb-14 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-[-0.02em]">
                Everything you need.
              </h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground/60 font-light max-w-lg mx-auto">
                Four tools that work together to simplify your monthly close.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.title} {...product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-16 sm:py-24 border-t border-border/30 bg-card/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal delay={0}>
              <div>
                <span className="text-[11px] font-semibold tracking-[0.05em] text-primary uppercase">Seamless</span>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-[-0.02em] mt-3">
                  Built for the way you work.
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground/70 mt-4 leading-relaxed max-w-sm">
                  CloseCycle adapts to your existing workflow. No complex setup, no training required.
                  Add your clients, set your templates, and you&apos;re ready.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Works with any accounting software",
                    "Templates for every close checklist",
                    "Automated email sequences",
                    "Real-time status updates",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground/70">
                      <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/signup" className="text-sm text-primary hover:underline underline-offset-2 inline-flex items-center gap-1 group">
                    Get started
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">&#x2192;</span>
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative rounded-2xl overflow-hidden border border-border/30 min-h-[320px] sm:min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/[0.05] via-card to-background">
                <div className="text-center p-8">
                  <div className="grid grid-cols-4 gap-2 max-w-[200px] mx-auto mb-6">
                    {["bg-primary/30", "bg-emerald-500/30", "bg-amber-500/30", "bg-purple-500/30"].map((c, i) => (
                      <div key={i} className={`h-8 rounded-lg ${c}`} style={{ opacity: 0.3 + i * 0.15 }} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground/50">Interactive demo</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 sm:py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-[-0.02em]">
                Simple pricing.
              </h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground/60 font-light">
                One plan. No surprises.
              </p>
            </div>
          </Reveal>

          <div className="max-w-md mx-auto">
            <Reveal delay={100}>
              <TiltCard>
                <div className="rounded-2xl border border-border/40 bg-card p-8 sm:p-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.03] rounded-full blur-[80px] pointer-events-none" />
                  <div className="relative">
                    <span className="text-[11px] font-semibold tracking-[0.05em] text-primary uppercase">One plan</span>
                    <div className="flex items-baseline justify-center gap-1 mt-4">
                      <span className="text-5xl sm:text-6xl font-semibold text-foreground tracking-tight">$29</span>
                      <span className="text-sm text-muted-foreground/60">/month</span>
                    </div>
                    <p className="text-xs text-muted-foreground/50 mt-1">14-day free trial. No credit card required.</p>

                    <ul className="mt-8 space-y-3 text-left max-w-[260px] mx-auto">
                      {[
                        "Up to 20 clients",
                        "Unlimited document templates",
                        "Automated email reminders",
                        "Client document portal",
                        "Priority email support",
                        "Monthly analytics",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-foreground/70">
                          <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <Link
                        href="/signup"
                        className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:bg-primary/90 active:scale-[0.97] group"
                      >
                        Start Free Trial
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">&#x2192;</span>
                      </Link>
                    </div>
                    <p className="text-[11px] text-muted-foreground/40 mt-4">Unlike competitors charging $228&ndash;$804/year upfront</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 border-t border-border/30 bg-card/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal delay={0}>
              <div>
                <span className="text-[11px] font-semibold tracking-[0.05em] text-primary uppercase">Community</span>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-[-0.02em] mt-3">
                  Join solo bookkeepers everywhere.
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground/70 mt-4 leading-relaxed max-w-sm">
                  Thousands of solo bookkeepers use CloseCycle to stay organized, reduce stress, and close faster every month.
                </p>
                <div className="mt-8 flex items-center -space-x-2">
                  {["from-blue-500 to-blue-700", "from-emerald-500 to-emerald-700", "from-purple-500 to-purple-700", "from-amber-500 to-amber-700"].map((g, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br ${g}`} />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] text-primary font-semibold">+1K</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "14", label: "Day trial" },
                  { value: "20", label: "Client max" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "4.9", label: "Rating" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border/30 bg-card p-5 text-center">
                    <div className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">{s.value}</div>
                    <div className="text-[11px] text-muted-foreground/50 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/30 bg-card/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h4 className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-wider mb-3">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo className="w-4 h-4" />
              <span className="text-[11px] text-muted-foreground/40">CloseCycle</span>
            </div>
            <p className="text-[11px] text-muted-foreground/40">
              Copyright &copy; {new Date().getFullYear()} CloseCycle. All rights reserved.
            </p>
            <div className="flex gap-4">
              {["Privacy", "Terms", "Legal"].map((l) => (
                <Link key={l} href="#" className="text-[11px] text-muted-foreground/40 hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
