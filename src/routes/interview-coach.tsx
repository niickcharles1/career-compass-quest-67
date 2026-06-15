import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, Sparkles, MessageSquare, Target, Gauge } from "lucide-react";
import { CCNav, CCFooter } from "@/components/cc/Nav";

export const Route = createFileRoute("/interview-coach")({
  head: () => ({
    meta: [
      { title: "AI Interview Coach (Coming Soon) — Career Compass" },
      { name: "description", content: "Practice role-specific interview questions and get instant AI feedback. Coming soon." },
      { property: "og:title", content: "AI Interview Coach — Career Compass" },
      { property: "og:description", content: "Role-specific interview practice with instant feedback." },
      { property: "og:url", content: "https://career-compass-quest-67.lovable.app/interview-coach" },
    ],
    links: [{ rel: "canonical", href: "https://career-compass-quest-67.lovable.app/interview-coach" }],
  }),
  component: InterviewCoachPage,
});

const ROLES = ["Consulting", "Product", "Marketing", "Finance", "Tech"];

function InterviewCoachPage() {
  return (
    <div className="min-h-screen bg-background">
      <CCNav />
      <main>
        {/* Hero */}
        <section className="px-5 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-teal-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)]">
              <Sparkles className="h-3.5 w-3.5" /> Coming Soon
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-primary md:text-5xl">
              Practice the interview before you walk in.
            </h1>
            <p className="mx-auto mt-5 max-w-[580px] text-base text-muted-foreground md:text-lg">
              Pick your target role, answer real interview questions out loud, and get instant feedback on structure, clarity, and impact.
            </p>
          </div>
        </section>

        {/* Mock UI */}
        <section className="px-5 pb-16">
          <div className="mx-auto max-w-5xl">
            <div className="relative rounded-2xl border border-border bg-white p-6 shadow-card md:p-8">
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Preview
              </span>

              {/* Role selector */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target role</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ROLES.map((r, i) => (
                    <button
                      key={r}
                      disabled
                      className={`cursor-not-allowed rounded-full border px-4 py-1.5 text-sm font-medium ${
                        i === 0
                          ? "border-[var(--color-teal)] bg-[var(--color-teal-soft)] text-[var(--color-teal)]"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question + answer */}
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/30 p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)]">Question 3 of 10</span>
                  <p className="mt-3 text-lg font-semibold leading-snug text-primary">
                    "Walk me through a time you used data to change someone's mind."
                  </p>
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <button
                      disabled
                      className="inline-flex h-16 w-16 cursor-not-allowed items-center justify-center rounded-full bg-[var(--color-orange)] text-white opacity-60 shadow-elevated"
                    >
                      <Mic className="h-7 w-7" />
                    </button>
                    <span className="text-xs text-muted-foreground">Tap to record · 0:00 / 2:00</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live feedback</span>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Structure (STAR)", score: 7 },
                      { label: "Clarity", score: 8 },
                      { label: "Business impact", score: 6 },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-primary">{m.label}</span>
                          <span className="text-muted-foreground">{m.score}/10</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-[var(--color-teal)]"
                            style={{ width: `${m.score * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg border border-[var(--color-teal)]/30 bg-[var(--color-teal-soft)]/40 p-3 text-sm leading-relaxed text-primary">
                    <strong className="text-[var(--color-teal)]">Tip:</strong> Lead with the result. "I cut review time by 40%" lands harder than starting with context.
                  </div>
                  <button disabled className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-primary opacity-60">
                    Next Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-border bg-white px-5 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold text-primary md:text-3xl">What it will do</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                { Icon: Target, t: "Role-specific question banks", d: "Consulting cases, product sense, finance technicals, marketing scenarios — and more." },
                { Icon: MessageSquare, t: "Speak or type your answer", d: "Practice out loud with voice transcription, or type it out — whichever fits your flow." },
                { Icon: Gauge, t: "Instant, honest feedback", d: "See where your structure, clarity, and business impact land — with one concrete improvement per answer." },
              ].map((f) => (
                <div key={f.t} className="rounded-xl border border-border p-6">
                  <f.Icon className="h-6 w-6 text-[var(--color-teal)]" />
                  <h3 className="mt-3 text-lg font-bold text-primary">{f.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-primary md:text-3xl">Get the foundations in place first.</h2>
            <p className="mt-3 text-muted-foreground">Finish your assessment so the coach knows which roles to drill you on.</p>
            <Link to="/assessment" className="mt-7 inline-flex h-12 min-w-[220px] items-center justify-center rounded-lg bg-[var(--color-orange)] px-6 font-semibold text-white shadow-elevated hover:opacity-90">
              Start My Assessment
            </Link>
          </div>
        </section>
      </main>
      <CCFooter />
    </div>
  );
}
