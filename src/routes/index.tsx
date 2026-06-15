import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Brain, FileText, BarChart2, Zap, GraduationCap, Search, UserX } from "lucide-react";
import { CCNav, CCFooter } from "@/components/cc/Nav";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <CCNav />
      <main>
        {/* Hero */}
        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-teal)]">For International Students & Graduates</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-primary text-balance md:text-6xl">
              Finally understand what you bring to the table.
            </h1>
            <p className="mx-auto mt-6 max-w-[560px] text-base text-muted-foreground md:text-lg">
              Career Compass helps you discover your professional strengths, translate your academic experiences into employer language, and know exactly what to do next.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/assessment" className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-lg bg-[var(--color-orange)] px-6 font-semibold text-white shadow-elevated hover:opacity-90">
                Start My Assessment
              </Link>
              <a href="#how-it-works" className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-lg border-2 border-primary px-6 font-semibold text-primary hover:bg-primary/5">
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Free · No account required · Takes 5 minutes</p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-y border-border bg-white px-5 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">From confusion to clarity in 4 steps</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {[
                { n: "01", Icon: Brain, t: "Discover Your Professional Identity", d: "Answer 15 questions about your strengths, interests, and work style. Get a clear picture of who you are professionally." },
                { n: "02", Icon: FileText, t: "Translate Your Experience", d: "Upload your CV or describe your academic projects. We rewrite them in the language employers actually respond to." },
                { n: "03", Icon: BarChart2, t: "See Your Career Readiness", d: "Understand where you're strong and where the gaps are — with no vague advice, just honest clarity." },
                { n: "04", Icon: Zap, t: "Get Your Top 3 Actions", d: "Walk away with exactly three specific things you should do this week to improve your employability." },
              ].map((s) => (
                <div key={s.n} className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold tracking-wider text-[var(--color-teal)]">{s.n}</span>
                    <s.Icon className="h-5 w-5 text-[var(--color-teal)]" />
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-primary">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="bg-primary px-5 py-20 text-white">
          <div className="mx-auto max-w-5xl">
            <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold md:text-4xl">
              The real reason you're struggling isn't your effort.{"\n\n"}
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { Icon: GraduationCap, h: "You speak academic.", b: "Universities reward grades and coursework. Employers evaluate problem-solving and business impact. Nobody teaches you to bridge that gap." },
                { Icon: Search, h: "You're searching in all the wrong places.", b: "LinkedIn, career fairs, and generic advice pull you in every direction. What you need is one clear next step." },
                { Icon: UserX, h: "You don't know what makes you different.", b: "Most students can't answer 'why should we hire you?' — not because they're unqualified, but because nobody helped them figure it out." },
              ].map((c) => (
                <div key={c.h}>
                  <c.Icon className="h-7 w-7 text-[var(--color-orange)]" />
                  <h3 className="mt-4 text-lg font-bold text-white">{c.h}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="bg-muted px-5 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-2xl font-medium italic leading-relaxed text-primary md:text-3xl">
              "I finally felt like I understood what I actually bring to the table — not just my degree."
            </p>
            <p className="mt-5 text-sm text-muted-foreground">— Sarah M., International Management Graduate, Barcelona</p>
            <span className="mt-6 inline-block rounded-full bg-[var(--color-teal-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--color-teal)]">
              The feeling we design for
            </span>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-white px-5 py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-primary md:text-4xl">Ready to find your direction?</h2>
            <p className="mt-3 text-muted-foreground">It takes 5 minutes. No fluff, no generic advice.</p>
            <Link to="/assessment" className="mt-8 inline-flex h-14 min-w-[240px] items-center justify-center rounded-lg bg-[var(--color-orange)] px-8 text-base font-semibold text-white shadow-elevated hover:opacity-90">
              Start My Assessment
            </Link>
          </div>
        </section>
      </main>
      <CCFooter />
    </div>
  );
}
