import { motion } from "framer-motion";
import { Linkedin, GraduationCap, MessageSquare, Building2, X } from "lucide-react";

const sources = [
  {
    icon: Linkedin,
    name: "LinkedIn",
    flaw: "Unstructured noise",
    detail: "Influencer takes. No comparison. No context for you.",
  },
  {
    icon: GraduationCap,
    name: "Professors",
    flaw: "Generic advice",
    detail: "Helpful, but built for the average student — not for you.",
  },
  {
    icon: MessageSquare,
    name: "Reddit / YouTube",
    flaw: "Biased & loud",
    detail: "Survivorship bias. Whoever shouts loudest wins your attention.",
  },
  {
    icon: Building2,
    name: "Career centres",
    flaw: "Slow & impersonal",
    detail: "30-minute slots, generic frameworks, three-week wait times.",
  },
];

export function Problem() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-ink py-24 text-paper md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="container relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-electric">
              The problem
            </p>
            <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
              Every career source you have is broken in a different way.
            </h2>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-paper/65">
              Most students choose based on salary, parents, or whichever subject they happened to
              be good at in school. That's why most of them regret it by year three.
            </p>
            <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-paper/65">
              You don't need more opinions. You need a structured way to compare your options.
            </p>
          </motion.div>

          <div className="md:col-span-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sources.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative rounded-lg border border-paper/10 bg-paper/[0.03] p-5 transition-colors hover:border-paper/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-paper/10">
                        <s.icon className="h-4 w-4 text-paper/80" />
                      </span>
                      <span className="font-semibold text-paper">{s.name}</span>
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                  </div>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-electric/80">
                    {s.flaw}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper/55">{s.detail}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 rounded-lg border border-electric/30 bg-electric/10 p-5"
            >
              <p className="text-sm leading-relaxed text-paper">
                <span className="font-semibold text-electric">Your Choice</span> is the first
                structured, personalised, unbiased system for career decisions — built so you can
                see the real trade-offs before you commit.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
