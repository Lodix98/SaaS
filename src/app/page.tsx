"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback, ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const current = -rect.top;
      setProgress(Math.max(0, Math.min(1, total > 0 ? current / total : 0)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return progress;
}

function useIntersection(
  ref: React.RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setEntry(e), options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);
  return entry;
}

function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersection(ref, { threshold: 0.1 });
  const visible = entry?.isIntersecting ?? false;

  const getTransform = () => {
    if (!visible) {
      if (direction === "up") return "translateY(60px)";
      if (direction === "left") return "translateX(-60px)";
      if (direction === "right") return "translateX(60px)";
    }
    return "translate(0)";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y - r.height / 2) / r.height) * -10;
      const ry = ((x - r.width / 2) / r.width) * 10;
      el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      el.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => (el.style.transition = ""), 600);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={cn("will-change-transform", className)} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

function HoverSwapCard({
  label,
  sublabel,
  gradientFrom,
  gradientTo,
  hoverGradientFrom,
  hoverGradientTo,
}: {
  label: string;
  sublabel: string;
  gradientFrom: string;
  gradientTo: string;
  hoverGradientFrom: string;
  hoverGradientTo: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          opacity: hovered ? 0 : 1,
        }}
      />
      <div
        className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: `linear-gradient(135deg, ${hoverGradientFrom}, ${hoverGradientTo})`,
          opacity: hovered ? 1 : 0,
        }}
      />
      <div
        className="relative p-6 sm:p-8 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[240px]"
        style={{ transform: "translateZ(24px)" }}
      >
        <div
          className="text-center transition-all duration-500"
          style={{ transform: hovered ? "translateZ(32px) scale(1.05)" : "translateZ(0)" }}
        >
          <div className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-1">{sublabel}</div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{label}</div>
        </div>
      </div>
    </div>
  );
}

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#gallery", label: "Gallery" },
  { href: "#story", label: "Story" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
];

const galleryItems = [
  { id: 1, title: "Dashboard", desc: "Monthly close at a glance", color: "from-blue-600/30 to-purple-600/30", accent: "bg-blue-500/20" },
  { id: 2, title: "Client Grid", desc: "Visual status tracking", color: "from-emerald-600/30 to-teal-600/30", accent: "bg-emerald-500/20" },
  { id: 3, title: "Portal", desc: "Simple document upload", color: "from-orange-600/30 to-red-600/30", accent: "bg-orange-500/20" },
  { id: 4, title: "Reports", desc: "Automated monthly summaries", color: "from-pink-600/30 to-rose-600/30", accent: "bg-pink-500/20" },
  { id: 5, title: "Reminders", desc: "Smart email automation", color: "from-cyan-600/30 to-blue-600/30", accent: "bg-cyan-500/20" },
  { id: 6, title: "Analytics", desc: "Track your close rate", color: "from-violet-600/30 to-purple-600/30", accent: "bg-violet-500/20" },
];

const journeySteps = [
  { year: "2019", title: "The Beginning", desc: "Started freelancing as a bookkeeper for local businesses. Spreadsheets and sticky notes.", gradient: "from-blue-600 to-blue-800" },
  { year: "2021", title: "Growing Pains", desc: "10+ clients. Monthly close was chaos. Missed deadlines, late nights, lost documents.", gradient: "from-blue-600 to-indigo-800" },
  { year: "2023", title: "The Idea", desc: "Built a simple grid to track client status. One spreadsheet became a workflow.", gradient: "from-indigo-600 to-purple-800" },
  { year: "2024", title: "CloseCycle", desc: "Turned the system into an app. Solo bookkeepers finally had a tool built for them.", gradient: "from-purple-600 to-pink-800" },
  { year: "2025", title: "The Future", desc: "AI-powered close predictions, document auto-classification, and seamless integrations.", gradient: "from-pink-600 to-rose-800" },
];

const helmetCards = [
  { label: "Visual Grid", sublabel: "Feature", from: "#3b82f6", to: "#1d4ed8", hFrom: "#6366f1", hTo: "#4338ca" },
  { label: "Auto Reminders", sublabel: "Feature", from: "#10b981", to: "#059669", hFrom: "#14b8a6", hTo: "#0d9488" },
  { label: "Client Portal", sublabel: "Feature", from: "#f59e0b", to: "#d97706", hFrom: "#f97316", hTo: "#ea580c" },
  { label: "Secure Upload", sublabel: "Feature", from: "#ef4444", to: "#dc2626", hFrom: "#e11d48", hTo: "#be123c" },
  { label: "Email Templates", sublabel: "Feature", from: "#8b5cf6", to: "#7c3aed", hFrom: "#a855f7", hTo: "#9333ea" },
  { label: "Dashboard", sublabel: "Feature", from: "#06b6d4", to: "#0891b2", hFrom: "#0ea5e9", hTo: "#0284c7" },
  { label: "Automations", sublabel: "Feature", from: "#84cc16", to: "#65a30d", hFrom: "#22c55e", hTo: "#16a34a" },
  { label: "Reporting", sublabel: "Feature", from: "#ec4899", to: "#db2777", hFrom: "#f43f5e", hTo: "#e11d48" },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const storySectionRef = useRef<HTMLDivElement>(null);
  const storyInnerRef = useRef<HTMLDivElement>(null);

  const galleryProgress = useScrollProgress(gallerySectionRef);
  const storyProgress = useScrollProgress(storySectionRef);

  const totalGalleryWidth = galleryItems.length * 320;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const galleryTranslate = -galleryProgress * Math.max(0, totalGalleryWidth - viewportW + 64);

  useEffect(() => {
    const idx = Math.min(Math.floor(storyProgress * journeySteps.length), journeySteps.length - 1);
    setStepIndex(idx);
  }, [storyProgress]);

  const handleLockToggle = useCallback(() => {
    setLocked((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background" style={{ scrollBehavior: "smooth" }}>
      <header className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-8 h-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
            <span className="font-semibold text-lg text-foreground tracking-tight">CloseCycle</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] active:scale-[0.95]"
            >
              Start Free Trial
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
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
                  className="block text-sm text-muted-foreground hover:text-foreground py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground py-2">
                Log in
              </Link>
            </div>
          </div>
        )}
      </header>

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none animate-pulse-soft" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-semibold tracking-wide uppercase mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
              Built for solo bookkeepers
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={120}>
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold text-foreground leading-[0.92] tracking-tight">
              Your monthly<br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">close cycle.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={240}>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              One click to see who&apos;s on track, who&apos;s missing docs, and what needs attention.
              Built for people who need to close the books.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={360}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="group bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.6)] hover:-translate-y-1 active:scale-[0.95] inline-flex items-center gap-2"
              >
                Start Free Trial
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#story"
                className="border border-border text-foreground px-8 py-4 rounded-full text-base font-medium transition-all duration-300 hover:bg-accent"
              >
                Our Story
              </Link>
            </div>
          </ScrollReveal>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: "2.5s" }}>
            <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            {[
              { value: "14", label: "Day free trial" },
              { value: "$29", label: "Per month" },
              { value: "20", label: "Max clients" },
              { value: "99.9%", label: "Uptime" },
            ].map((s, i) => (
              <ScrollReveal key={s.label} direction="up" delay={i * 80}>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1.5">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section ref={gallerySectionRef} id="gallery" className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center bg-background">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
          <div
            className="flex gap-6 px-8 transition-none will-change-transform"
            style={{ transform: `translateX(${galleryTranslate}px)` }}
          >
            {galleryItems.map((item, i) => (
              <div
                key={item.id}
                className={`relative shrink-0 w-[300px] h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br ${item.color} border border-border/50`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
                <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl ${item.accent} flex items-center justify-center`}>
                  <span className="text-white text-sm font-bold">{String(item.id).padStart(2, "0")}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" ref={storySectionRef} className="relative h-[500vh]">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal direction="left" delay={0}>
                <div ref={storyInnerRef}>
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={handleLockToggle}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${locked ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
                      aria-label={locked ? "Unlock scroll" : "Lock scroll"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={locked ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"} />
                      </svg>
                    </button>
                    <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                      {locked ? "Scroll to explore" : "tap to lock"}
                    </span>
                  </div>
                  <div className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full inline-block mb-6">
                    {journeySteps[stepIndex].year}
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05]">
                    {journeySteps[stepIndex].title}
                  </h2>
                  <p className="text-lg text-muted-foreground mt-6 leading-relaxed max-w-md">
                    {journeySteps[stepIndex].desc}
                  </p>
                  <div className="flex gap-2 mt-8">
                    {journeySteps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${i <= stepIndex ? "bg-primary w-8" : "bg-border w-4"}`}
                      />
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <div className="hidden lg:block relative h-[500px] rounded-3xl overflow-hidden">
                <div
                  className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    background: `linear-gradient(135deg, ${journeySteps[stepIndex].gradient})`,
                    transform: `scale(${1 + stepIndex * 0.02})`,
                  }}
                />
                <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="text-8xl font-bold text-white/10 tracking-tight select-none"
                    style={{ transform: `translateZ(40px)` }}
                  >
                    {journeySteps[stepIndex].year}
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4">
                    {[0, 1, 2, 3, 4].map((dot) => (
                      <div
                        key={dot}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${dot === stepIndex ? "bg-white scale-150" : "bg-white/30"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-24">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Services</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-6 tracking-tight">
                Everything you need<br />to close the books
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            {[
              {
                side: "left",
                gradient: "from-blue-600/20 via-blue-600/5 to-transparent",
                title: "Visual Close Grid",
                desc: "See every client's monthly close status at a glance. Color-coded, filterable, sortable. One view replaces a dozen spreadsheets.",
                features: ["Drag-and-drop status updates", "Filter by close stage", "Color-coded priority flags", "Real-time sync across devices"],
              },
              {
                side: "right",
                gradient: "from-purple-600/20 via-purple-600/5 to-transparent",
                title: "Automated Reminders",
                desc: "Set your reminder cadence once. CloseCycle automatically emails clients when documents are due, overdue, or missing.",
                features: ["Customizable email templates", "Automatic escalation sequence", "Client-facing status page", "Delivery and open tracking"],
              },
              {
                side: "left",
                gradient: "from-emerald-600/20 via-emerald-600/5 to-transparent",
                title: "Client Portal",
                desc: "A simple, no-login link for clients to upload bank statements, receipts, and reports. No passwords, no frustration.",
                features: ["One-click upload links", "File type validation", "Encrypted transmission", "Automatic file organization"],
              },
            ].map((section, i) => (
              <div
                key={section.title}
                className="min-h-screen flex items-center"
              >
                <div
                  className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${section.side === "right" ? "" : ""}`}
                >
                  {section.side === "right" ? (
                    <>
                      <ScrollReveal direction="left" delay={i * 100}>
                        <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-border/50">
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(135deg, ${section.gradient})` }}
                          />
                          <div className="absolute inset-0 bg-card/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center p-8">
                              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  {i === 0 ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /> :
                                    i === 1 ? <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" /> :
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75a2.25 2.25 0 01-2.25 2.25H21" />
                                  }
                                </svg>
                              </div>
                              <p className="text-muted-foreground text-sm">Interactive demo coming soon</p>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                      <ScrollReveal direction="right" delay={i * 100 + 50}>
                        <div>
                          <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Service 0{i + 1}</span>
                          <h3 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 tracking-tight">{section.title}</h3>
                          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{section.desc}</p>
                          <ul className="mt-8 space-y-3">
                            {section.features.map((f) => (
                              <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </ScrollReveal>
                    </>
                  ) : (
                    <>
                      <ScrollReveal direction="left" delay={i * 100}>
                        <div>
                          <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Service 0{i + 1}</span>
                          <h3 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 tracking-tight">{section.title}</h3>
                          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{section.desc}</p>
                          <ul className="mt-8 space-y-3">
                            {section.features.map((f) => (
                              <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </ScrollReveal>
                      <ScrollReveal direction="right" delay={i * 100 + 50}>
                        <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-border/50">
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(135deg, ${section.gradient})` }}
                          />
                          <div className="absolute inset-0 bg-card/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center p-8">
                              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  {i === 0 ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /> :
                                    i === 1 ? <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" /> :
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75a2.25 2.25 0 01-2.25 2.25H21" />
                                  }
                                </svg>
                              </div>
                              <p className="text-muted-foreground text-sm">Interactive demo coming soon</p>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="helmets" className="py-32 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-20">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Hall of Fame</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-6 tracking-tight">Features you&apos;ll love</h2>
              <p className="text-muted-foreground mt-4 text-lg max-w-lg mx-auto">
                From the essential to the innovative, every feature built to save you time.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {helmetCards.map((card, i) => (
              <ScrollReveal key={card.label} direction={i % 4 < 2 ? "left" : "right"} delay={i * 60}>
                <TiltCard>
                  <HoverSwapCard
                    label={card.label}
                    sublabel={card.sublabel}
                    gradientFrom={card.from}
                    gradientTo={card.to}
                    hoverGradientFrom={card.hFrom}
                    hoverGradientTo={card.hTo}
                  />
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left">
              <div className="bg-card rounded-3xl border border-border p-10 sm:p-14 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full relative">Pricing</span>
                <div className="flex items-baseline gap-1 mt-6 mb-2 relative">
                  <span className="text-6xl font-bold text-foreground tracking-tight">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-8 relative">14-day free trial &mdash; no credit card required</p>
                <ul className="space-y-4 mb-10 relative">
                  {["Up to 20 clients", "Unlimited document templates", "Automated email reminders", "Client portal for document upload", "Priority support", "Monthly analytics report"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="relative block w-full text-center bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.6)] hover:-translate-y-1 active:scale-[0.95]"
                >
                  Start Your Free Trial
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-4 relative">Unlike competitors charging $228&ndash;$804/year upfront</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="space-y-8">
                <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-[1.05]">
                  Simple.<br />
                  <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">Transparent.</span>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  No annual contracts. No hidden fees. Just one plan for solo bookkeepers.
                  Built for people who need to close the books, not close deals.
                </p>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">Trusted by solo bookkeepers everywhere</p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br ${["from-blue-500 to-blue-700", "from-emerald-500 to-emerald-700", "from-purple-500 to-purple-700", "from-amber-500 to-amber-700"][i]}`}
                      />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs text-primary font-semibold">
                      +1K
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  {["No setup fee", "Cancel anytime", "Free updates", "Email support"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">Social</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-6 tracking-tight">Follow the journey</h2>
            </div>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: "Twitter", href: "#", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              { name: "GitHub", href: "#", icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" },
              { name: "YouTube", href: "#", icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              { name: "LinkedIn", href: "#", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="group flex items-center gap-3 px-6 py-3 rounded-full border border-border hover:bg-accent transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
                <span className="text-sm font-medium text-foreground">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Logo className="w-7 h-7" />
              <span className="text-sm font-semibold text-foreground">CloseCycle</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} CloseCycle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
