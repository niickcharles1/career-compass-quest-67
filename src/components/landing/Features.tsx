import { motion } from "framer-motion";
import { Zap, MapPin, Brain, Check } from "lucide-react";

const features = [
  {
    icon: Zap,
    tag: "01 — The quiz",
    title: "A 5-minute interactive quiz that doesn’t feel like one.",
    desc: "It’s not a dry survey. It’s an engaging experience that respects your time and asks the questions that actually matter.",
    bullets: ["Swipe-style answers", "Smart branching logic", "Save & resume anytime"],
    mock: "quiz",
  },
  {
    icon: MapPin,
    tag: "02 — The match",
    title: "“Work-style” matching, not just grades.",
    desc: "We don’t just look at academics. We look at how you actually want to work — remote, in an office, on the move, solo, or in a team.",
    bullets: ["Lifestyle preferences", "Location & flexibility", "Income vs. impact balance"],
    mock: "match",
  },
  {
    icon: Brain,
    tag: "03 — The science",
    title: "Expert-backed algorithms, not vibes.",
    desc: "Our system uses data from real career consultants and is verified by 5,000+ students. Your results are recommendations, not random labels.",
    bullets: ["Built with career pros", "Updated with market data", "Future-proof scoring"],
    mock: "science",
  },
];

function Mock({ kind }: { kind: string }) {
  if (kind === "quiz") {
    return (
      <div className="aspect-square w-full rounded-3xl bg-gradient-warm p-6">
        <div className="flex h-full flex-col rounded-2xl bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Question 4 of 12</span>
            <span className="text-primary">⏱ 3:42 left</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/3 rounded-full bg-gradient-sunset" />
          </div>
          <p className="mt-6 font-display text-xl font-medium">
            When you finish a project, you feel best about…
          </p>
          <div className="mt-4 flex flex-1 flex-col gap-2">
            {["The clean process", "The wow reaction", "Solving the puzzle", "Helping someone"].map(
              (opt, i) => (
                <div
                  key={opt}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium ${
                    i === 1
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-ink/10 text-foreground/70"
                  }`}
                >
                  {opt}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }
  if (kind === "match") {
    return (
      <div className="aspect-square w-full rounded-3xl bg-gradient-warm p-6">
        <div className="flex h-full flex-col gap-3 rounded-2xl bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your top 3 paths
          </p>
          {[
            { t: "UX Researcher", m: 96, c: "oklch(0.7 0.2 45)" },
            { t: "Product Designer", m: 88, c: "oklch(0.65 0.18 25)" },
            { t: "Brand Strategist", m: 81, c: "oklch(0.6 0.15 350)" },
          ].map((p) => (
            <div key={p.t} className="rounded-xl border border-ink/10 p-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{p.t}</span>
                <span className="text-sm font-bold" style={{ color: p.c }}>
                  {p.m}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${p.m}%`, background: p.c }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-square w-full rounded-3xl bg-gradient-ink p-6">
      <div className="flex h-full flex-col gap-3 rounded-2xl bg-cream/5 p-5 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wider text-cream/60">
          Behind the scenes
        </p>
        {[
          "Personality fit",
          "Skill alignment",
          "Market demand 2026",
          "Lifestyle match",
          "Growth potential",
        ].map((row, i) => (
          <div
            key={row}
            className="flex items-center justify-between rounded-lg border border-cream/10 bg-cream/5 px-3 py-2 text-sm text-cream"
          >
            <span>{row}</span>
            <span className="font-mono text-xs text-primary">
              {[92, 88, 81, 95, 87][i]}/100
            </span>
          </div>
        ))}
        <div className="mt-auto rounded-lg bg-primary/20 p-3 text-xs text-cream">
          <span className="font-semibold text-primary">✓ Ready</span> · Cross-checked with 47
          career advisors
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-balance text-center text-4xl font-medium leading-tight md:text-6xl"
        >
          Why it actually <span className="italic text-primary">works</span>.
        </motion.h2>

        <div className="mt-20 space-y-24 md:space-y-32">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 ${
                i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <Mock kind={f.mock} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <p className="text-sm font-mono font-medium uppercase tracking-wider text-primary">
                  {f.tag}
                </p>
                <h3 className="mt-3 text-balance text-3xl font-medium leading-tight md:text-4xl">
                  {f.title}
                </h3>
                <p className="mt-5 text-pretty text-lg text-muted-foreground">{f.desc}</p>
                <ul className="mt-6 space-y-3">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
