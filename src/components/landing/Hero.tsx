import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-student.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-warm pt-28 pb-16 md:pt-32 md:pb-24">
      {/* Floating decorative blobs */}
      <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
      <div
        className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-blush/40 blur-3xl animate-float-slow"
        style={{ animationDelay: "2s" }}
      />

      <div className="container relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card/60 px-4 py-1.5 text-xs font-medium backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            5-minute career test · 100% free
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-balance text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl lg:text-[5.5rem]"
          >
            Find your dream career
            <span className="relative whitespace-nowrap">
              {" "}
              <span className="italic text-primary">without</span>
            </span>{" "}
            the second-guessing.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl"
          >
            Tell us what you’re good at and what you love. We’ll map out the 3 career paths that
            actually fit your life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Button variant="hero" size="xl" asChild>
              <a href="#start">
                Start my free test <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground">
              ✦ No credit card · Results in 5 min
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[
                "oklch(0.75 0.15 30)",
                "oklch(0.65 0.18 60)",
                "oklch(0.7 0.12 350)",
                "oklch(0.6 0.15 200)",
              ].map((bg, i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-background"
                  style={{ background: bg }}
                />
              ))}
            </div>
            <p className="text-sm font-medium">
              Join <span className="font-bold">5,000+ students</span> who found their path this year
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:col-span-5"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-sunset opacity-30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 shadow-glow">
              <img
                src={heroImage}
                alt="Student smiling while exploring career paths on her laptop"
                width={1024}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute -bottom-6 -left-6 rounded-2xl border border-ink/10 bg-card px-5 py-4 shadow-soft md:-left-10"
            >
              <p className="text-3xl font-bold text-primary">92%</p>
              <p className="text-xs text-muted-foreground">feel more confident about their future</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
