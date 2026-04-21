import { motion } from "framer-motion";
import { Check, ArrowRight, TrendingUp, Briefcase, MapPin } from "lucide-react";

const features = [
  {
    tag: "01 — Comparison engine",
    title: "Two paths. Side by side. No guesswork.",
    desc: "Pick any two careers and see them compared across salary curves, lifestyle, autonomy, risk, and 10-year outlook. Most people pick based on one variable. That's the mistake.",
    bullets: [
      "12 decision dimensions",
      "Honest trade-off flags",
      "Salary projected to year 10",
    ],
    mock: "compare",
  },
  {
    tag: "02 — Career timeline",
    title: "Year 1 → Year 5 → Year 10. Mapped.",
    desc: "Every path you match with comes with a realistic timeline: what your role looks like, what you'll be earning, and what skills compound. Built from real career data, not LinkedIn fantasy.",
    bullets: [
      "Realistic salary curves",
      "Skill stack progression",
      "When to pivot vs stay",
    ],
    mock: "timeline",
  },
  {
    tag: "03 — Decision tree",
    title: "Branching choices, not single labels.",
    desc: "Most career tests give you a label. We give you a tree: each fork shows a real trade-off, and your inputs map you to a specific branch — with the alternatives still visible.",
    bullets: [
      "Branching scoring model",
      "Built with 47 career consultants",
      "Verified by 5,000+ student outcomes",
    ],
    mock: "tree",
  },
];

function CompareMock() {
  const rows = [
    { label: "Year 1 salary", a: "$72k", b: "$95k", winner: "b" },
    { label: "Year 5 salary", a: "$145k", b: "$132k", winner: "a" },
    { label: "Lifestyle", a: "Hybrid", b: "On-site", winner: "a" },
    { label: "Autonomy", a: "High", b: "Medium", winner: "a" },
    { label: "Risk", a: "Medium", b: "Low", winner: "b" },
    { label: "10-yr outlook", a: "+18%", b: "+4%", winner: "a" },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
      <div className="grid grid-cols-3 border-b border-border bg-mist text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
        <div className="px-4 py-2.5">Dimension</div>
        <div className="border-l border-border px-4 py-2.5">
          <span className="text-electric">●</span> Product Designer
        </div>
        <div className="border-l border-border px-4 py-2.5">
          <span className="text-foreground/40">●</span> Investment Analyst
        </div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={`grid grid-cols-3 text-sm ${i !== rows.length - 1 ? "border-b border-border" : ""}`}
        >
          <div className="px-4 py-3 font-medium text-muted-foreground">{r.label}</div>
          <div
            className={`border-l border-border px-4 py-3 font-mono tabular-nums ${
              r.winner === "a" ? "bg-electric/5 font-semibold text-foreground" : "text-foreground/70"
            }`}
          >
            {r.a}
          </div>
          <div
            className={`border-l border-border px-4 py-3 font-mono tabular-nums ${
              r.winner === "b" ? "bg-electric/5 font-semibold text-foreground" : "text-foreground/70"
            }`}
          >
            {r.b}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-border bg-mist px-4 py-2.5">
        <span className="font-mono text-[11px] text-muted-foreground">Net fit score</span>
        <span className="font-mono text-sm font-bold tabular-nums text-electric">
          94 <span className="font-normal text-muted-foreground">vs</span>{" "}
          <span className="text-foreground/60">71</span>
        </span>
      </div>
    </div>
  );
}

function TimelineMock() {
  const steps = [
    {
      year: "Year 1",
      role: "Junior Designer",
      salary: "$72k",
      skills: ["Figma", "UX basics"],
      tone: "default",
    },
    {
      year: "Year 3",
      role: "Mid Designer",
      salary: "$98k",
      skills: ["Systems", "Research"],
      tone: "growth",
    },
    {
      year: "Year 5",
      role: "Senior / Lead",
      salary: "$145k",
      skills: ["Strategy", "Mentoring"],
      tone: "electric",
    },
    {
      year: "Year 10",
      role: "Principal / Head of",
      salary: "$210k+",
      skills: ["Org design", "Hiring"],
      tone: "ink",
    },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card p-5 shadow-elevated">
      <div className="mb-5 flex items-center justify-between">
        <h4 className="font-display text-lg">Path projection</h4>
        <span className="font-mono text-[11px] text-muted-foreground">
          <span className="text-growth">●</span> Live market data
        </span>
      </div>
      <div className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.year} className="relative flex items-start gap-4">
              <span
                className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background ${
                  s.tone === "electric"
                    ? "bg-electric text-white"
                    : s.tone === "growth"
                      ? "bg-growth text-white"
                      : s.tone === "ink"
                        ? "bg-ink text-paper"
                        : "bg-mist text-foreground"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
              </span>
              <div className="flex-1 rounded-lg border border-border bg-background p-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.year}
                  </span>
                  <span className="font-mono text-sm font-bold tabular-nums">{s.salary}</span>
                </div>
                <p className="mt-0.5 text-sm font-semibold">{s.role}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.skills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TreeMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-ink p-6 text-paper shadow-elevated">
      <div className="mb-5 flex items-center justify-between">
        <h4 className="font-display text-lg text-paper">Your decision branches</h4>
        <span className="font-mono text-[11px] text-paper/50">Step 4 / 5</span>
      </div>
      <div className="space-y-3">
        <div className="rounded-md border border-paper/15 bg-paper/5 px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-electric">
            ROOT · You
          </span>
          <p className="mt-1 text-sm font-medium">Analytical · Creative · Hybrid lifestyle</p>
        </div>
        <div className="ml-5 border-l-2 border-dashed border-paper/15 pl-4">
          <div className="space-y-2">
            {[
              { branch: "Design-led", score: 94, active: true },
              { branch: "Research-led", score: 81, active: false },
              { branch: "Engineering-led", score: 67, active: false },
            ].map((b) => (
              <div
                key={b.branch}
                className={`flex items-center justify-between rounded-md border px-3 py-2.5 transition-colors ${
                  b.active
                    ? "border-electric/40 bg-electric/15"
                    : "border-paper/10 bg-paper/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 rounded-full ${b.active ? "bg-electric" : "bg-paper/25"}`}
                  />
                  <span
                    className={`text-sm font-medium ${b.active ? "text-paper" : "text-paper/55"}`}
                  >
                    {b.branch}
                  </span>
                </div>
                <span
                  className={`font-mono text-xs tabular-nums ${b.active ? "font-bold text-electric" : "text-paper/50"}`}
                >
                  {b.score}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-md bg-warning/15 px-3 py-2 text-[11px] text-paper/85">
          <span className="text-warning">▲</span>
          <span>
            Trade-off flagged: Design-led scores higher, but Research-led has 30% less competition.
          </span>
        </div>
      </div>
    </div>
  );
}

function Mock({ kind }: { kind: string }) {
  if (kind === "compare") return <CompareMock />;
  if (kind === "timeline") return <TimelineMock />;
  return <TreeMock />;
}

export function Features() {
  return (
    <section id="paths" className="border-b border-border bg-mist py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-electric">
            How it works
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Three structured layers between you and the wrong choice.
          </h2>
        </motion.div>

        <div className="mt-20 space-y-24 md:space-y-28">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 ${
                i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
              >
                <Mock kind={f.mock} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.12 }}
              >
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-electric">
                  {f.tag}
                </p>
                <h3 className="mt-3 text-balance font-display text-3xl leading-tight md:text-[2.5rem]">
                  {f.title}
                </h3>
                <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  {f.desc}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[15px]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric/15 text-electric">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="font-medium text-foreground/85">{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#start"
                  className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-electric transition-all hover:gap-2.5"
                >
                  Try this on your own decision <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4"
        >
          {[
            { v: "5,000+", l: "students mapped" },
            { v: "47", l: "career consultants" },
            { v: "400+", l: "career paths" },
            { v: "92%", l: "feel more confident" },
          ].map((s) => (
            <div key={s.l} className="bg-card p-6 text-center">
              <p className="font-display text-3xl font-medium text-foreground md:text-4xl">{s.v}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.l}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
