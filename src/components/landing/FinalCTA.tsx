import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section
      id="start"
      className="relative overflow-hidden bg-gradient-ink py-28 text-cream md:py-40"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-blush/20 blur-3xl animate-float-slow" />

      <div className="container relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Your future is waiting
          </p>
          <h2 className="mt-6 text-balance font-display text-5xl font-medium leading-[1] md:text-7xl lg:text-8xl">
            Ready to meet your <span className="italic text-primary">future self</span>?
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-pretty text-lg text-cream/70 md:text-xl">
            Get your personalized career plan in the next 5 minutes. Free, private, and built for
            who you actually are.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="xl">
              Yes, I want to try! <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-sm text-cream/50">No signup needed to start</p>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-cream/60">
            <span>✓ GDPR compliant</span>
            <span>✓ 5,000+ students</span>
            <span>✓ 4.9/5 rating</span>
            <span>✓ Built with career pros</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
