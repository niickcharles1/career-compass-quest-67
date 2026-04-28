import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  LogOut,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Columns3,
  LayoutGrid,
  Calendar,
  Briefcase,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CareerResults, CareerPath, TradeOff, EducationStep } from "./api.career.generate";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: "Your top 3 career paths · Your Choice" },
      {
        name: "description",
        content:
          "Your tailored career map: 3 paths with match scores, trade-offs, and education steps.",
      },
    ],
  }),
});

type ViewMode = "cards" | "compare";
type TabKey = "tradeoffs" | "education" | "next";

function ResultsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<CareerResults | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hydrating, setHydrating] = useState(true);
  const [retaking, setRetaking] = useState(false);
  const [view, setView] = useState<ViewMode>("cards");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("id, career_results, completed")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!active) return;
      if (error || !data || !data.completed || !data.career_results) {
        navigate({ to: "/quiz" });
        return;
      }
      setSessionId(data.id);
      setResults(data.career_results as unknown as CareerResults);
      setHydrating(false);
    })();
    return () => {
      active = false;
    };
  }, [user, navigate]);

  const handleRetake = async () => {
    if (!user || !sessionId) return;
    setRetaking(true);
    const { error } = await supabase
      .from("quiz_sessions")
      .update({
        completed: false,
        current_step: 0,
        answers: {},
        career_results: null,
      })
      .eq("id", sessionId);
    setRetaking(false);
    if (error) {
      toast.error("Couldn't reset your quiz");
      return;
    }
    navigate({ to: "/quiz" });
  };

  if (loading || hydrating || !results) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg font-medium">
            Your Choice
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleRetake} disabled={retaking}>
              <RefreshCw className="h-4 w-4" /> Retake
            </Button>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">
              Your career map
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Your top 3 paths
            </h1>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              {results.summary}
            </p>
          </div>

          <div className="inline-flex shrink-0 rounded-lg border border-border bg-card p-1">
            <ViewToggleButton
              active={view === "cards"}
              onClick={() => setView("cards")}
              icon={<LayoutGrid className="h-4 w-4" />}
              label="Cards"
            />
            <ViewToggleButton
              active={view === "compare"}
              onClick={() => setView("compare")}
              icon={<Columns3 className="h-4 w-4" />}
              label="Compare"
            />
          </div>
        </div>

        <div className="mt-10">
          {view === "cards" ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {results.paths.map((path, i) => (
                <PathCard key={i} path={path} rank={i + 1} defaultExpanded={i === 0} />
              ))}
            </div>
          ) : (
            <CompareTable paths={results.paths} />
          )}
        </div>

        <TimelineSection paths={results.paths} />

        <div className="mt-16 grid gap-6 rounded-xl border border-border bg-gradient-to-br from-electric/5 to-card p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">
              Ready to act?
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold">
              Get a personalized roadmap to break in
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Tell us where you're starting from and upload your resume — we'll map the exact
              steps to land your first role in any of these paths.
            </p>
          </div>
          <Link to="/next-steps">
            <Button variant="primary" className="w-full md:w-auto">
              Plan my next steps <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="font-display text-2xl font-semibold">Want to compare differently?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Adjust your answers and re-run to see how different priorities reshape your top paths.
          </p>
          <Button variant="primary" className="mt-6" onClick={handleRetake} disabled={retaking}>
            {retaking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Resetting…
              </>
            ) : (
              <>
                Retake the quiz <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-electric text-white shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function PathCard({
  path,
  rank,
  defaultExpanded,
}: {
  path: CareerPath;
  rank: number;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [tab, setTab] = useState<TabKey>("tradeoffs");
  const matchPct = Math.round(path.match);

  return (
    <motion.article
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "flex flex-col rounded-xl border bg-card shadow-card transition-colors",
        rank === 1 ? "border-electric/40" : "border-border",
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Match #{rank}
            {rank === 1 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-electric/10 px-2 py-0.5 text-[10px] font-semibold text-electric">
                <Sparkles className="h-2.5 w-2.5" /> Top fit
              </span>
            )}
          </span>
          <MatchScore value={matchPct} />
        </div>

        <h3 className="mt-4 font-display text-xl font-semibold leading-tight">{path.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{path.why}</p>

        <div className="mt-6 grid grid-cols-3 gap-2 rounded-lg border border-border bg-background p-3">
          {[
            { label: "Year 1", v: path.salary.year1 },
            { label: "Year 5", v: path.salary.year5 },
            { label: "Year 10", v: path.salary.year10 },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 font-display text-sm font-semibold">{s.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <InlineFact icon={<TrendingUp className="h-4 w-4" />} label="Growth" value={path.growth} />
          <InlineFact label="Lifestyle" value={path.lifestyle} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center justify-between border-t border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
        aria-expanded={expanded}
      >
        <span>{expanded ? "Hide details" : "See trade-offs & education path"}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border"
          >
            <div className="px-6 pb-6 pt-5">
              <div className="flex gap-1 rounded-lg border border-border bg-background p-1">
                <TabButton active={tab === "tradeoffs"} onClick={() => setTab("tradeoffs")}>
                  Trade-offs
                </TabButton>
                <TabButton active={tab === "education"} onClick={() => setTab("education")}>
                  Education
                </TabButton>
                <TabButton active={tab === "next"} onClick={() => setTab("next")}>
                  Next 2 weeks
                </TabButton>
              </div>

              <div className="mt-5 min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {tab === "tradeoffs" && <TradeoffsView items={path.tradeoffs} />}
                    {tab === "education" && <EducationView items={path.education} />}
                    {tab === "next" && <NextStepsView items={path.firstSteps} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function MatchScore({ value }: { value: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-14 w-14">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="hsl(var(--border, 220 13% 91%))"
          strokeWidth="3"
          className="text-border"
        />
        <motion.circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-electric"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${(value / 100) * circumference} ${circumference}` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xs font-semibold text-foreground">{value}%</span>
      </div>
    </div>
  );
}

function InlineFact({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-xs leading-snug text-foreground">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function TradeoffsView({ items }: { items: TradeOff[] }) {
  const severityStyles = {
    low: "bg-growth/10 text-growth border-growth/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-danger/10 text-danger border-danger/20",
  } as const;

  return (
    <ul className="space-y-3">
      {items.map((t, i) => (
        <li key={i} className="rounded-lg border border-border bg-background p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
              {t.label}
            </p>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                severityStyles[t.severity],
              )}
            >
              {t.severity}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t.detail}</p>
        </li>
      ))}
    </ul>
  );
}

function EducationView({ items }: { items: EducationStep[] }) {
  return (
    <ol className="relative space-y-4 border-l border-border pl-5">
      {items.map((step, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full border border-electric bg-card">
            <GraduationCap className="h-2.5 w-2.5 text-electric" />
          </span>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-electric">
                {step.stage}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{step.title}</p>
            </div>
            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {step.duration}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function NextStepsView({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((s, i) => (
        <li key={i} className="flex gap-2 rounded-lg border border-border bg-background p-3 text-sm leading-relaxed">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

function CompareTable({ paths }: { paths: CareerPath[] }) {
  const rows = useMemo(
    () => [
      { label: "Match", render: (p: CareerPath) => `${Math.round(p.match)}%` },
      { label: "Year 1", render: (p: CareerPath) => p.salary.year1 },
      { label: "Year 5", render: (p: CareerPath) => p.salary.year5 },
      { label: "Year 10", render: (p: CareerPath) => p.salary.year10 },
      { label: "Lifestyle", render: (p: CareerPath) => p.lifestyle },
      { label: "Growth", render: (p: CareerPath) => p.growth },
      {
        label: "Top trade-off",
        render: (p: CareerPath) =>
          p.tradeoffs[0] ? `${p.tradeoffs[0].label} — ${p.tradeoffs[0].detail}` : "—",
      },
      {
        label: "Education path",
        render: (p: CareerPath) =>
          p.education.map((e) => `${e.title} (${e.duration})`).join(" → "),
      },
    ],
    [],
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-mist">
            <th className="w-40 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Compare
            </th>
            {paths.map((p, i) => (
              <th key={i} className="px-5 py-3 font-display text-base font-semibold">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    #{i + 1}
                  </span>
                  {p.title}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={row.label}
              className={cn("border-b border-border last:border-0", ri % 2 === 1 && "bg-mist/40")}
            >
              <td className="px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {row.label}
              </td>
              {paths.map((p, i) => (
                <td key={i} className="px-5 py-3 align-top text-foreground">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TIMELINE_MILESTONES = [
  {
    key: "year1" as const,
    label: "Year 1",
    headline: "Entry & foundation",
    icon: Rocket,
    blurb: "Where you land right after graduation — first role, first paycheck.",
  },
  {
    key: "year5" as const,
    label: "Year 5",
    headline: "Mid-career traction",
    icon: Briefcase,
    blurb: "Specialization kicks in. Promotions, lateral moves, or first leadership.",
  },
  {
    key: "year10" as const,
    label: "Year 10",
    headline: "Senior trajectory",
    icon: TrendingUp,
    blurb: "Senior IC, management, or pivot into adjacent high-leverage roles.",
  },
];

function TimelineSection({ paths }: { paths: CareerPath[] }) {
  const pathColors = ["text-electric", "text-foreground", "text-muted-foreground"];
  const pathDots = ["bg-electric", "bg-foreground", "bg-muted-foreground"];

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">
            <Calendar className="mr-1.5 inline h-3 w-3" /> 10-year outlook
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Where each path takes you
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Side-by-side projection of salary, role, and lifestyle across Year 1, 5, and 10.
          </p>
        </div>
        <div className="hidden shrink-0 flex-wrap gap-3 md:flex">
          {paths.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={cn("h-2 w-2 rounded-full", pathDots[i])} />
              <span className="font-medium text-foreground">{p.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative px-8 pt-10">
            <div className="absolute left-8 right-8 top-[60px] h-px bg-border" />
            <div className="relative grid grid-cols-3 gap-8">
              {TIMELINE_MILESTONES.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={m.key} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-electric bg-card shadow-card">
                        <Icon className="h-4 w-4 text-electric" />
                      </div>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-electric">
                        {m.label}
                      </p>
                      <p className="mt-1 font-display text-base font-semibold">{m.headline}</p>
                      <p className="mt-1.5 max-w-[200px] text-xs leading-relaxed text-muted-foreground">
                        {m.blurb}
                      </p>
                    </div>

                    <div className="mt-6 space-y-3">
                      {paths.map((p, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.3, delay: idx * 0.1 + i * 0.05 }}
                          className="rounded-lg border border-border bg-background p-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", pathDots[i])} />
                            <p className={cn("truncate text-[11px] font-semibold", pathColors[i])}>
                              {p.title}
                            </p>
                          </div>
                          <p className="mt-2 font-display text-lg font-semibold text-foreground">
                            {p.salary[m.key]}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-border bg-mist/40 px-8 py-4 text-center text-xs text-muted-foreground">
            Salary ranges are AI-projected based on your inputs and current market data.
          </div>
        </div>

        {/* Mobile: stacked per milestone */}
        <div className="md:hidden">
          {TIMELINE_MILESTONES.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={m.key}
                className={cn("p-5", idx > 0 && "border-t border-border")}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-electric bg-card">
                    <Icon className="h-4 w-4 text-electric" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric">
                      {m.label}
                    </p>
                    <p className="font-display text-sm font-semibold">{m.headline}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {paths.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", pathDots[i])} />
                        <p className="truncate text-xs font-semibold text-foreground">{p.title}</p>
                      </div>
                      <p className="font-display text-sm font-semibold">{p.salary[m.key]}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
