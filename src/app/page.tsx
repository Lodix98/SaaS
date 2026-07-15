"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo, ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function useRafScrollProgress(sectionRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const update = () => {
      rafRef.current = 0;
      const rect = el!.getBoundingClientRect();
      const total = el!.scrollHeight - window.innerHeight;
      const current = -rect.top;
      setProgress(Math.max(0, Math.min(1, total > 0 ? current / total : 0)));
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sectionRef]);

  return progress;
}

function useOnScreen(ref: React.RefObject<HTMLElement | null>, threshold = 0.1) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return visible;
}

function Reveal({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.1,
  className = "",
}: {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  threshold?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(ref, threshold);

  const translateMap = useMemo(() => ({
    up: "translateY(50px)",
    left: "translateX(-50px)",
    right: "translateX(50px)",
  }), []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : translateMap[direction],
        transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const r = el!.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ x: x * 12, y: y * -12 });
      });
    };

    const onLeave = () => { setHovering(false); setTilt({ x: 0, y: 0 }); };
    const onEnter = () => setHovering(true);

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        transformStyle: "preserve-3d",
        transform: hovering
          ? `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.03,1.03,1.03)`
          : "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
        transition: hovering ? "none" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

function HoverSwapCard({
  title,
  subtitle,
  gradientFrom,
  gradientTo,
  hoverFrom,
  hoverTo,
}: {
  title: string;
  subtitle: string;
  gradientFrom: string;
  gradientTo: string;
  hoverFrom: string;
  hoverTo: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          opacity: hovered ? 0 : 1,
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{
          background: `linear-gradient(135deg, ${hoverFrom}, ${hoverTo})`,
          opacity: hovered ? 1 : 0,
        }}
      />
      <div
        className="relative p-6 sm:p-8 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[240px]"
        style={{ transform: "translateZ(28px)" }}
      >
        <div className={`text-center transition-all duration-500 ${hovered ? "scale-105" : ""}`}>
          <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/60 mb-1.5">{subtitle}</div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</div>
        </div>
      </div>
    </div>
  );
}

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#gallery", label: "Gallery" },
  { href: "#story", label: "Story" },
  { href: "#pricing", label: "Pricing" },
];

const GALLERY = [
  { id: 1, title: "Dashboard", desc: "Monthly close at a glance", gradient: "from-blue-600/20 to-purple-600/20" },
  { id: 2, title: "Client Grid", desc: "Visual status tracking", gradient: "from-emerald-600/20 to-teal-600/20" },
  { id: 3, title: "Portal", desc: "Simple document upload", gradient: "from-orange-600/20 to-red-600/20" },
  { id: 4, title: "Reports", desc: "Automated summaries", gradient: "from-pink-600/20 to-rose-600/20" },
  { id: 5, title: "Reminders", desc: "Smart email automation", gradient: "from-cyan-600/20 to-blue-600/20" },
  { id: 6, title: "Analytics", desc: "Track close rate", gradient: "from-violet-600/20 to-purple-600/20" },
  { id: 7, title: "Invoicing", desc: "Generate invoices", gradient: "from-amber-600/20 to-orange-600/20" },
  { id: 8, title: "Archive", desc: "Historical data", gradient: "from-slate-600/20 to-gray-600/20" },
];

const STORY = [
  { year: "2019", title: "The Beginning", desc: "Started freelancing as a bookkeeper. Spreadsheets and sticky notes carried me through.", gradient: "linear-gradient(135deg, #1e40af, #1e3a5f)" },
  { year: "2021", title: "Growing Pains", desc: "Ten clients in. Monthly close was chaos. Missed deadlines and lost documents.", gradient: "linear-gradient(135deg, #1e40af, #3730a3)" },
  { year: "2023", title: "The Idea", desc: "Built a simple grid to track every client's status. One spreadsheet became a workflow.", gradient: "linear-gradient(135deg, #3730a3, #5b21b6)" },
  { year: "2024", title: "CloseCycle", desc: "Turned the system into an app. Solo bookkeepers finally have a tool built for them.", gradient: "linear-gradient(135deg, #5b21b6, #9d174d)" },
  { year: "2025", title: "What's Next", desc: "AI-powered predictions, auto-classification, and seamless bank integrations.", gradient: "linear-gradient(135deg, #9d174d, #be123c)" },
];

const HELMETS = [
  { title: "Visual Grid", subtitle: "Feature", gradientFrom: "#3b82f6", gradientTo: "#1d4ed8", hoverFrom: "#6366f1", hoverTo: "#4338ca" },
  { title: "Auto Reminders", subtitle: "Feature", gradientFrom: "#10b981", gradientTo: "#059669", hoverFrom: "#14b8a6", hoverTo: "#0d9488" },
  { title: "Client Portal", subtitle: "Feature", gradientFrom: "#f59e0b", gradientTo: "#d97706", hoverFrom: "#f97316", hoverTo: "#ea580c" },
  { title: "Secure Upload", subtitle: "Feature", gradientFrom: "#ef4444", gradientTo: "#dc2626", hoverFrom: "#e11d48", hoverTo: "#be123c" },
  { title: "Email Templates", subtitle: "Feature", gradientFrom: "#8b5cf6", gradientTo: "#7c3aed", hoverFrom: "#a855f7", hoverTo: "#9333ea" },
  { title: "Dashboard", subtitle: "Feature", gradientFrom: "#06b6d4", gradientTo: "#0891b2", hoverFrom: "#0ea5e9", hoverTo: "#0284c7" },
  { title: "Automations", subtitle: "Feature", gradientFrom: "#84cc16", gradientTo: "#65a30d", hoverFrom: "#22c55e", hoverTo: "#16a34a" },
  { title: "Reporting", subtitle: "Feature", gradientFrom: "#ec4899", gradientTo: "#db2777", hoverFrom: "#f43f5e", hoverTo: "#e11d48" },
];

const FEATURES = [
  {
    title: "Visual Close Grid",
    desc: "See every client's monthly close status at a glance. One view that replaces a dozen spreadsheets.",
    items: ["Drag-and-drop status updates", "Filter by close stage", "Color-coded priority flags", "Real-time sync"],
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.05))",
  },
  {
    title: "Automated Reminders",
    desc: "Set it once. CloseCycle emails clients when documents are due, overdue, or missing — automatically.",
    items: ["Customizable email templates", "Automatic escalation", "Client-facing status page", "Delivery tracking"],
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(20,184,166,0.05))",
  },
  {
    title: "Client Portal",
    desc: "A no-login link for clients to upload bank statements, receipts, and reports. No passwords, no friction.",
    items: ["One-click upload links", "File type validation", "Encrypted transmission", "Auto file organization"],
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(217,70,239,0.05))",
  },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const galleryProgress = useRafScrollProgress(galleryRef);
  const storyProgress = useRafScrollProgress(storyRef);

  const galleryTranslate = useMemo(() => {
    const total = GALLERY.length * 300;
    const viewport = typeof window !== "undefined" ? window.innerWidth : 1200;
    return -galleryProgress * Math.max(0, total - viewport + 48);
  }, [galleryProgress]);

  const storyIndex = useMemo(() => {
    return Math.min(Math.floor(storyProgress * STORY.length), STORY.length - 1);
  }, [storyProgress]);

  const storyBlend = useMemo(() => {
    const raw = storyProgress * (STORY.length - 1);
    return raw - Math.floor(raw);
  }, [storyProgress]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-white">
      <header className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-8 h-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
            <span className="font-semibold text-lg text-foreground tracking-tight">CloseCycle</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-muted-foreground/80 hover:text-foreground transition-colors duration-300">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:inline-flex text-sm text-muted-foreground/80 hover:text-foreground transition-colors duration-300">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] active:scale-[0.95]"
            >
              Start Free Trial
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-foreground" aria-label="Menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
            <div className="px-5 py-4 space-y-3">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground/80 hover:text-foreground py-2">
                  {l.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground/80 hover:text-foreground py-2">
                Log in
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-primary/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pt-32 pb-24 text-center">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[11px] text-primary font-semibold tracking-[0.12em] uppercase mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Built for solo bookkeepers
            </div>
          </Reveal>

          <Reveal direction="up" delay={120}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground leading-[0.92] tracking-[-0.04em]">
              Your monthly<br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">close cycle.</span>
            </h1>
          </Reveal>

          <Reveal direction="up" delay={240}>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
              One click to see who&apos;s on track, who&apos;s missing docs, and what needs attention.
            </p>
          </Reveal>

          <Reveal direction="up" delay={360}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="group bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:scale-[0.95] inline-flex items-center gap-2"
              >
                Start Free Trial
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#story"
                className="border border-border/60 text-foreground px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:bg-accent/50 active:scale-[0.95]"
              >
                See How It Works
              </Link>
            </div>
          </Reveal>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] text-muted-foreground/50 tracking-[0.2em] uppercase">Scroll</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-16">
            {[
              { value: "14", label: "Day Free Trial" },
              { value: "$29", label: "Per Month" },
              { value: "20", label: "Max Clients" },
              { value: "99.9%", label: "Uptime" },
            ].map((s, i) => (
              <Reveal key={s.label} direction="up" delay={i * 80} threshold={0.5}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{s.value}</div>
                  <div className="text-xs text-muted-foreground/60 mt-1.5 tracking-wide">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section ref={galleryRef} id="gallery" className="relative" style={{ height: `${GALLERY.length * 100 + 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center bg-background">
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div
            className="flex gap-5 px-5 sm:px-8 will-change-transform"
            style={{ transform: `translate3d(${galleryTranslate}px, 0, 0)` }}
          >
            {GALLERY.map((item, i) => (
              <div
                key={item.id}
                className={`relative shrink-0 w-[260px] sm:w-[300px] h-[360px] sm:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-br ${item.gradient} border border-border/40`}
              >
                <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]" />
                <div className="absolute top-5 left-5 flex items-center gap-3">
                  <div className="w-[1px] h-6 bg-foreground/20" />
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-foreground/40 uppercase">0{i + 1}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground/70 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={storyRef} id="story" className="relative" style={{ height: `${STORY.length * 100 + 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/50 uppercase">Scroll to explore</span>
                </div>

                <div
                  className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-semibold tracking-[0.12em] uppercase mb-5 transition-all duration-500"
                >
                  <span>{STORY[storyIndex].year}</span>
                </div>

                <div className="relative" style={{ height: "8rem" }}>
                  {STORY.map((step, i) => {
                    const isActive = i === storyIndex;
                    const isPrev = i < storyIndex;
                    const offset = isActive ? 0 : isPrev ? -1 : 1;
                    return (
                      <div
                        key={step.year}
                        className="absolute inset-x-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: `translateY(${offset * 20}px)`,
                          pointerEvents: isActive ? "auto" : "none",
                        }}
                      >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.05]">
                          {step.title}
                        </h2>
                      </div>
                    );
                  })}
                </div>

                <div className="relative mt-4" style={{ height: "4.5rem" }}>
                  {STORY.map((step, i) => {
                    const isActive = i === storyIndex;
                    const isPrev = i < storyIndex;
                    const offset = isActive ? 0 : isPrev ? -1 : 1;
                    return (
                      <p
                        key={step.year}
                        className="absolute inset-x-0 text-sm sm:text-base text-muted-foreground/70 leading-relaxed max-w-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: `translateY(${offset * 15}px)`,
                          pointerEvents: isActive ? "auto" : "none",
                        }}
                      >
                        {step.desc}
                      </p>
                    );
                  })}
                </div>

                <div className="flex gap-2 mt-8">
                  {STORY.map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${i <= storyIndex ? "bg-primary" : "bg-border/40"}`}
                      style={{ width: i <= storyIndex ? "2rem" : "0.75rem" }}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden lg:block relative h-[450px] rounded-3xl overflow-hidden border border-border/30">
                {STORY.map((step, i) => (
                  <div
                    key={step.year}
                    className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                    style={{
                      background: step.gradient,
                      opacity: i === storyIndex ? 1 : 0,
                      transform: `scale(${i === storyIndex ? 1 : 1.05})`,
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-8xl sm:text-9xl font-bold text-white/10 tracking-tight select-none transition-all duration-700"
                    style={{ transform: "translateZ(60px)" }}
                  >
                    {STORY[storyIndex].year}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                  {STORY.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === storyIndex ? "bg-white w-8" : "bg-white/20 w-1.5"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <Reveal direction="up">
            <div className="max-w-xl mx-auto text-center mb-20">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Services</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-5 tracking-tight">
                Everything you need to<br />close the books
              </h2>
            </div>
          </Reveal>

          <div className="space-y-20 sm:space-y-28">
            {FEATURES.map((section, i) => (
              <div
                key={section.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 0 ? "" : "lg:direction-rtl"}`}
                style={{ direction: i % 2 === 1 ? "rtl" : "ltr" }}
              >
                <Reveal direction={i % 2 === 0 ? "left" : "right"} delay={i * 100}>
                  <div style={{ direction: "ltr" }}>
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">
                      Service 0{i + 1}
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-4 tracking-tight">{section.title}</h3>
                    <p className="text-muted-foreground/70 mt-3 text-base sm:text-lg leading-relaxed">{section.desc}</p>
                    <ul className="mt-8 space-y-3">
                      {section.items.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal direction={i % 2 === 0 ? "right" : "left"} delay={i * 100 + 50}>
                  <div className="relative h-[300px] sm:h-[400px] rounded-3xl overflow-hidden border border-border/30" style={{ direction: "ltr" }}>
                    <div className="absolute inset-0" style={{ background: section.gradient }} />
                    <div className="absolute inset-0 bg-card/40 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            {i === 0 ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                            ) : i === 1 ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75a2.25 2.25 0 01-2.25 2.25H21" />
                            )}
                          </svg>
                        </div>
                        <p className="text-muted-foreground/50 text-sm">Interactive demo</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="helmets" className="py-24 sm:py-32 border-t border-border/40 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <Reveal direction="up">
            <div className="max-w-xl mx-auto text-center mb-16">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Hall of Fame</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-5 tracking-tight">Features you&apos;ll love</h2>
              <p className="text-muted-foreground/60 mt-3 text-base max-w-md mx-auto">
                Every feature built to save you time.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {HELMETS.map((card, i) => (
              <Reveal key={card.title} direction="up" delay={i * 60} threshold={0.2}>
                <TiltCard>
                  <HoverSwapCard {...card} />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 sm:py-32 border-t border-border/40 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal direction="left">
              <div className="bg-card rounded-3xl border border-border/40 p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
                <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full relative">Pricing</span>
                <div className="flex items-baseline gap-1 mt-6 mb-2 relative">
                  <span className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight">$29</span>
                  <span className="text-muted-foreground/60 text-sm">/month</span>
                </div>
                <p className="text-sm text-muted-foreground/60 mb-8 relative">14-day free trial &mdash; no credit card required</p>
                <ul className="space-y-3.5 mb-10 relative">
                  {["Up to 20 clients", "Unlimited document templates", "Automated email reminders", "Client portal for document upload", "Priority support", "Monthly analytics report"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="relative block w-full text-center bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:scale-[0.95]"
                >
                  Start Your Free Trial
                </Link>
                <p className="text-xs text-muted-foreground/40 text-center mt-4 relative">Unlike competitors charging $228&ndash;$804/year upfront</p>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="space-y-8">
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]">
                  Simple.<br />
                  <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">Transparent.</span>
                </div>
                <p className="text-muted-foreground/70 text-base sm:text-lg leading-relaxed max-w-md">
                  No annual contracts. No hidden fees. One straightforward plan for solo bookkeepers.
                </p>
                <div className="pt-6 border-t border-border/40">
                  <p className="text-xs text-muted-foreground/50 mb-4 tracking-wide uppercase">Trusted by solo bookkeepers</p>
                  <div className="flex items-center -space-x-2">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div
                        key={i}
                        className={`w-9 h-9 rounded-full border-2 border-background bg-gradient-to-br ${["from-blue-500 to-blue-700", "from-emerald-500 to-emerald-700", "from-purple-500 to-purple-700", "from-amber-500 to-amber-700"][i]}`}
                      />
                    ))}
                    <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] text-primary font-semibold">
                      +1K
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["No setup fee", "Cancel anytime", "Free updates", "Email support"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground/60">
                      <svg className="w-3 h-3 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <Reveal direction="up">
            <div className="max-w-xl mx-auto text-center mb-14">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Follow</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-5 tracking-tight">Stay connected</h2>
            </div>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "X", href: "#", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              { name: "GitHub", href: "#", icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" },
              { name: "YouTube", href: "#", icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              { name: "LinkedIn", href: "#", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border/40 hover:bg-accent/30 active:scale-[0.97] transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
                <span className="text-xs font-medium text-foreground/80">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border/40 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo className="w-6 h-6" />
              <span className="text-sm font-semibold text-foreground">CloseCycle</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/40">&copy; {new Date().getFullYear()} CloseCycle</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
