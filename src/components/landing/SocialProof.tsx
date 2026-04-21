import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import anna from "@/assets/testimonial-anna.jpg";
import alex from "@/assets/testimonial-alex.jpg";
import maya from "@/assets/testimonial-maya.jpg";

const testimonials = [
  {
    quote:
      "I was choosing between design and CS based on starting salary. Your Choice showed me design pays less in year 1 but compounds harder. I switched paths.",
    name: "Anna",
    role: "Design student · 2nd year",
    img: anna,
    metric: "Switched major",
  },
  {
    quote:
      "Every advisor told me to go corporate. The comparison made the trade-offs obvious — startup risk was lower than I thought. A year in, no regrets.",
    name: "Alex",
    role: "Junior engineer · Berlin startup",
    img: alex,
    highlight: true,
    metric: "$92k base · year 1",
  },
  {
    quote:
      "I expected a personality test. I got a decision tree with real numbers. My parents stopped pushing law after I showed them the 10-year projection.",
    name: "Maya",
    role: "Pre-med, now data analyst track",
    img: maya,
    metric: "Saved 3 years",
  },
];

export function SocialProof() {
  return (
    <section className="border-b border-border bg-background py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-electric">
            Outcomes
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Decisions made visible. Years saved.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Real students. Real comparisons. Honest outcomes — including the trade-offs they
            weighed.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-xl border p-6 ${
                t.highlight
                  ? "border-ink bg-ink text-paper shadow-elevated"
                  : "border-border bg-card text-foreground shadow-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <Quote
                  className={`h-5 w-5 ${t.highlight ? "text-electric" : "text-electric/70"}`}
                />
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                    t.highlight
                      ? "bg-electric/20 text-electric"
                      : "bg-mist text-muted-foreground"
                  }`}
                >
                  {t.metric}
                </span>
              </div>
              <blockquote
                className={`mt-4 flex-1 text-pretty text-[15px] leading-relaxed ${
                  t.highlight ? "text-paper/90" : "text-foreground/85"
                }`}
              >
                "{t.quote}"
              </blockquote>
              <figcaption
                className={`mt-6 flex items-center gap-3 border-t pt-4 ${
                  t.highlight ? "border-paper/15" : "border-border"
                }`}
              >
                <img
                  src={t.img}
                  alt={t.name}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p
                    className={`text-xs ${t.highlight ? "text-paper/55" : "text-muted-foreground"}`}
                  >
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Logo strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 border-t border-border pt-10"
        >
          <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Used by students from
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-55">
            {["Northgate Uni", "Brightside College", "Atlas Academy", "Riverhill", "FutureSkills"].map(
              (logo) => (
                <span
                  key={logo}
                  className="font-display text-lg tracking-tight text-foreground"
                >
                  {logo}
                </span>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
