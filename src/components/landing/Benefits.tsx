import { motion } from "framer-motion";
import { Compass, Clock, Heart } from "lucide-react";

const benefits = [
  {
    icon: Compass,
    title: "Total clarity",
    desc: "Stop wondering “what if.” Get a concrete roadmap for your next steps.",
  },
  {
    icon: Clock,
    title: "Save years of time",
    desc: "Don’t waste time on the wrong degree. Know your best options in 5 minutes.",
  },
  {
    icon: Heart,
    title: "Made for you",
    desc: "No corporate fluff. Just career advice based on your unique personality and priorities.",
  },
];

export function Benefits() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            The Your Choice way
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium leading-tight md:text-6xl">
            A clear plan for a <span className="italic">confident</span> start.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-card p-8 shadow-card transition-all duration-500 hover:shadow-soft hover:-translate-y-1"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-sunset opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />
              <div className="relative">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-sunset text-primary-foreground shadow-glow">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">{b.title}</h3>
                <p className="mt-3 text-pretty text-muted-foreground">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
