import { motion } from "framer-motion";
import { HelpCircle, ArrowDown } from "lucide-react";

export function Problem() {
  return (
    <section className="relative bg-ink py-24 text-cream md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <div className="relative h-64 w-full">
              {[
                { label: "Marketing?", x: "10%", y: "5%", rot: -8 },
                { label: "Medicine?", x: "55%", y: "10%", rot: 5 },
                { label: "Design?", x: "25%", y: "45%", rot: 4 },
                { label: "Coding?", x: "65%", y: "55%", rot: -6 },
                { label: "Law?", x: "5%", y: "70%", rot: 3 },
                { label: "...?", x: "70%", y: "90%", rot: -3 },
              ].map((bubble, i) => (
                <motion.div
                  key={bubble.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="absolute rounded-full border border-cream/15 bg-cream/5 px-4 py-2 text-sm font-medium backdrop-blur"
                  style={{
                    left: bubble.x,
                    top: bubble.y,
                    transform: `rotate(${bubble.rot}deg)`,
                  }}
                >
                  {bubble.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/5 px-4 py-1.5 text-xs font-medium">
              <HelpCircle className="h-3.5 w-3.5" />
              The reality
            </div>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-tight md:text-6xl">
              Too many options, <br />
              <span className="italic text-primary">not enough</span> clarity?
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-lg text-cream/70 md:text-xl">
              Every second student is unsure about their future. It’s scary to think you might spend
              years studying for a job you’ll eventually hate.
            </p>
            <p className="mt-4 max-w-xl text-pretty text-lg text-cream/70 md:text-xl">
              We get it — the pressure to choose <em>“the one”</em> right now is overwhelming.
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm font-medium text-primary">
              <ArrowDown className="h-4 w-4 animate-bounce" />
              There’s a better way
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
