import { motion } from "framer-motion";
import { GitCompareArrows, LineChart, Layers, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: GitCompareArrows,
    label: "Compare honestly",
    title: "See trade-offs side-by-side.",
    desc: "Salary vs happiness. Risk vs stability. Startup vs corporate. We make every trade-off explicit so you choose with eyes open.",
    metric: "12 dimensions compared",
  },
  {
    icon: LineChart,
    label: "Project forward",
    title: "Year 1, year 5, year 10.",
    desc: "Every path comes with a 10-year projection: realistic salary curves, lifestyle shifts, and where this role is heading by 2035.",
    metric: "Updated with 2026 market data",
  },
  {
    icon: Layers,
    label: "Build your stack",
    title: "Know what to learn — and when.",
    desc: "Each path includes a sequenced skill stack: what to study first, what to add at year 2, and what makes you irreplaceable by year 5.",
    metric: "400+ career paths mapped",
  },
];

export function Benefits() {
  return (
    <section id="how" className="border-b border-border bg-background py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-electric">
            What you get
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Decision clarity, not motivation.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            We're not here to hype you up. We're here to show you the map.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="group relative flex flex-col rounded-xl border border-border bg-card p-7 shadow-card transition-all duration-300 hover:border-ink/25 hover:shadow-elevated"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-paper">
                  <b.icon className="h-4.5 w-4.5" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  0{i + 1}
                </span>
              </div>

              <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-wider text-electric">
                {b.label}
              </p>
              <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">
                {b.title}
              </h3>
              <p className="mt-3 flex-1 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                {b.desc}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="font-mono text-xs text-muted-foreground">{b.metric}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-electric" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
