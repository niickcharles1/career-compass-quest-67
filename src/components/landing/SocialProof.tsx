import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import anna from "@/assets/testimonial-anna.jpg";
import alex from "@/assets/testimonial-alex.jpg";
import maya from "@/assets/testimonial-maya.jpg";

const testimonials = [
  {
    quote:
      "I didn’t know if I should do design or coding. This test showed me how to combine both. I finally have a plan!",
    name: "Anna",
    age: 18,
    img: anna,
  },
  {
    quote:
      "A year ago I had no clue. Today I’m a junior engineer — exactly the path Your Choice suggested.",
    name: "Alex",
    age: 20,
    img: alex,
    highlight: true,
  },
  {
    quote:
      "Honestly the most useful 5 minutes I spent during senior year. My parents were shocked at how spot-on it was.",
    name: "Maya",
    age: 22,
    img: maya,
  },
];

export function SocialProof() {
  return (
    <section className="relative overflow-hidden bg-warm py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-balance text-4xl font-medium leading-tight md:text-6xl">
            <span className="text-primary">92%</span> of participants feel more confident about their
            future.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Real students. Real results. Zero corporate scripts.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`relative flex flex-col rounded-3xl p-8 shadow-card ${
                t.highlight
                  ? "bg-ink text-cream md:scale-[1.04] md:-translate-y-2"
                  : "bg-card text-foreground"
              }`}
            >
              <Quote
                className={`h-8 w-8 ${t.highlight ? "text-primary" : "text-primary/60"}`}
              />
              <blockquote
                className={`mt-4 flex-1 text-pretty text-lg leading-relaxed ${
                  t.highlight ? "text-cream" : ""
                }`}
              >
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img
                  src={t.img}
                  alt={`${t.name}, ${t.age}`}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {t.name}, {t.age}
                  </p>
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
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
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 border-t border-ink/10 pt-10"
        >
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by students from
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
            {["Northgate Uni", "Brightside College", "Atlas Academy", "Riverhill", "FutureSkills"].map(
              (logo) => (
                <span
                  key={logo}
                  className="font-display text-xl font-semibold tracking-tight text-foreground"
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
