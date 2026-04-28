import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Briefcase, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Hero — analytical, structured.
 * Right side replaced with a compact "decision dashboard" mock instead of a photo.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Subtle grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />

      <div className="container relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-12 md:gap-10">
        {/* Left — copy */}
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-growth animate-pulse-soft" />
            New · Built with 47 career consultants
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-balance font-display text-5xl leading-[1.02] tracking-tight text-foreground md:text-[4.5rem] lg:text-[5rem]"
          >
            See where your career
            <br />
            choices <span className="text-electric">actually</span> lead.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            The career decision engine for students who want clarity, not guesswork. Compare paths
            side-by-side — salary, lifestyle, growth, and what your day looks like in 5 years.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
          >
            <Button variant="primary" size="lg" asChild>
              <a href="/auth">
                See my career map <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#how">How it works</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-foreground/40" />
              5-min structured assessment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-foreground/40" />
              No signup to start
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-foreground/40" />
              5,000+ students mapped
            </span>
          </motion.div>
        </div>

        {/* Right — decision dashboard mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="md:col-span-5"
        >
          <DecisionDashboardMock />
        </motion.div>
      </div>
    </section>
  );
}

function DecisionDashboardMock() {
  const paths = [
    {
      title: "Product Designer",
      match: 94,
      salary: "$78k → $145k",
      lifestyle: "Hybrid · Flexible",
      growth: "+18% / 5y",
      tone: "electric",
    },
    {
      title: "Data Analyst",
      match: 87,
      salary: "$72k → $128k",
      lifestyle: "Remote-friendly",
      growth: "+22% / 5y",
      tone: "growth",
    },
    {
      title: "UX Researcher",
      match: 81,
      salary: "$68k → $118k",
      lifestyle: "Hybrid · Travel",
      growth: "+15% / 5y",
      tone: "ink",
    },
  ];

  return (
    <div className="relative">
      {/* Floating badge */}
      <div className="absolute -top-4 right-4 z-10 rounded-md border border-border bg-card px-3 py-1.5 text-[11px] font-mono font-medium text-muted-foreground shadow-card">
        <span className="text-growth">●</span> Your career map · Live
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border bg-mist px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            yourchoice.app/results
          </span>
          <span className="w-8" />
        </div>

        <div className="p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-xl">Your top 3 paths</h3>
            <span className="font-mono text-[11px] text-muted-foreground">Ranked by fit</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {paths.map((p, i) => (
              <div
                key={p.title}
                className={`group rounded-lg border p-3.5 transition-colors ${
                  i === 0 ? "border-electric/40 bg-electric/5" : "border-border bg-background"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-md ${
                        p.tone === "electric"
                          ? "bg-electric text-white"
                          : p.tone === "growth"
                            ? "bg-growth text-white"
                            : "bg-ink text-paper"
                      }`}
                    >
                      <Briefcase className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold">{p.title}</span>
                  </div>
                  <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                    {p.match}
                    <span className="text-muted-foreground">/100</span>
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <Stat icon={DollarSign} label={p.salary} />
                  <Stat icon={MapPin} label={p.lifestyle} />
                  <Stat icon={TrendingUp} label={p.growth} accent={p.tone === "growth"} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-md border border-dashed-soft border-warning/40 bg-warning/8 px-3 py-2 text-[11px]">
            <span className="font-medium text-foreground/80">
              <span className="text-warning">Trade-off:</span> Path #1 pays less in year 1 but
              compounds faster.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  accent,
}: {
  icon: typeof DollarSign;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-mist px-2 py-1.5 text-muted-foreground">
      <Icon className={`h-3 w-3 ${accent ? "text-growth" : ""}`} />
      <span className={`truncate font-medium ${accent ? "text-growth" : "text-foreground/75"}`}>
        {label}
      </span>
    </div>
  );
}
