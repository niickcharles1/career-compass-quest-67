import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section
      id="start"
      className="relative overflow-hidden border-b border-border bg-ink py-24 text-paper md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/15 blur-[120px]" />

      <div className="container relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-electric">
            Start your map
          </p>
          <h2 className="mt-5 text-balance font-display text-5xl leading-[1] md:text-6xl lg:text-7xl">
            Stop guessing. <span className="text-electric">Start mapping.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-paper/65 md:text-lg">
            Get your top 3 career paths in 5 minutes — with the trade-offs, the timelines, and the
            actual numbers. Free to start. No signup required.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="electric"
              size="lg"
              className="bg-electric text-white shadow-[0_8px_24px_-8px_oklch(0.62_0.18_235_/_0.6)]"
              asChild
            >
              <a href="/auth">See my career map <ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-paper/20 bg-transparent text-paper hover:border-paper/40 hover:bg-paper/5"
            >
              See a sample report
            </Button>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-paper/10 bg-paper/10 sm:grid-cols-3">
            {[
              { icon: Clock, label: "5 min", sub: "Structured assessment" },
              { icon: Users, label: "5,000+", sub: "Students mapped" },
              { icon: ShieldCheck, label: "GDPR", sub: "Encrypted · Private" },
            ].map((s) => (
              <div
                key={s.sub}
                className="flex items-center justify-center gap-3 bg-ink p-5 text-left"
              >
                <s.icon className="h-5 w-5 text-electric" />
                <div>
                  <p className="font-display text-lg leading-none text-paper">{s.label}</p>
                  <p className="mt-1 text-xs text-paper/55">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
