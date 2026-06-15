import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Sparkles, Target, Pencil, Copy, Download } from "lucide-react";
import { CCNav, CCFooter } from "@/components/cc/Nav";

export const Route = createFileRoute("/cover-letter")({
  head: () => ({
    meta: [
      { title: "Cover Letter Generator (Coming Soon) — Career Compass" },
      { name: "description", content: "AI cover letters tailored to any job description. Coming soon to Career Compass." },
      { property: "og:title", content: "Cover Letter Generator — Career Compass" },
      { property: "og:description", content: "Tailored cover letters for every role you apply to." },
      { property: "og:url", content: "https://career-compass-quest-67.lovable.app/cover-letter" },
    ],
    links: [{ rel: "canonical", href: "https://career-compass-quest-67.lovable.app/cover-letter" }],
  }),
  component: CoverLetterPage,
});

const SAMPLE_JD = `Marketing Analyst — Barcelona, Spain
We're looking for a curious, data-fluent graduate to join our growth team. You'll analyze campaign performance, build dashboards, and partner with brand managers to translate data into action.

Requirements:
- Strong analytical mindset, comfortable with Excel and SQL
- Excellent written and verbal English
- Bonus: experience with marketing tools (GA4, HubSpot)`;

const SAMPLE_LETTER = `Dear Hiring Manager,

I'm writing to apply for the Marketing Analyst role on your growth team. As an international management graduate with hands-on experience turning messy data into clear stories, I was drawn to your focus on translating analytics into action.

During my final-year project, I built a campaign attribution dashboard in SQL and Looker that helped a 30-person retail team cut wasted ad spend by 18% in one quarter. I love working at the intersection of data and brand — finding the one insight a marketer can act on Monday morning.

I would bring that same curiosity, rigor, and bias toward action to your team. I'd welcome the chance to discuss how I can help your brand managers move faster.

Warm regards,
Sarah M.`;

function CoverLetterPage() {
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
              Cover letters that match the job — in seconds.
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-base text-muted-foreground md:text-lg">
              Paste any job description. We'll generate a tailored cover letter that highlights the strengths from your assessment — in language employers actually respond to.
            </p>
          </div>
        </section>

        {/* Mock UI */}
        <section className="px-5 pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="relative rounded-2xl border border-border bg-white p-6 shadow-card md:p-8">
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Preview
              </span>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Input column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job description</label>
                    <textarea
                      readOnly
                      value={SAMPLE_JD}
                      className="mt-2 h-56 w-full resize-none rounded-lg border border-border bg-muted/40 p-3 text-sm text-primary/80"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your background</label>
                    <input
                      readOnly
                      value="International Management graduate, ESADE Barcelona"
                      className="mt-2 w-full rounded-lg border border-border bg-muted/40 p-3 text-sm text-primary/80"
                    />
                  </div>
                  <button
                    disabled
                    className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[var(--color-orange)] px-6 font-semibold text-white opacity-60"
                  >
                    <Sparkles className="h-4 w-4" /> Generate Cover Letter
                  </button>
                </div>

                {/* Output column */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generated letter</label>
                    <div className="flex gap-2">
                      <button disabled className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground opacity-60">
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                      <button disabled className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground opacity-60">
                        <Download className="h-3 w-3" /> PDF
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 h-[336px] overflow-hidden rounded-lg border border-border bg-white p-5 text-sm leading-relaxed text-primary/90 shadow-inner">
                    <pre className="whitespace-pre-wrap font-sans">{SAMPLE_LETTER}</pre>
                  </div>
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
                { Icon: Target, t: "Tailored to the role", d: "Mirrors keywords and tone from the job description — no generic templates." },
                { Icon: FileText, t: "Built on your assessment", d: "Pulls your real strengths and stories so every letter sounds like you." },
                { Icon: Pencil, t: "Fully editable", d: "Tweak any line, regenerate paragraphs, and export to PDF when you're ready." },
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
            <h2 className="text-2xl font-bold text-primary md:text-3xl">Want to be ready when it launches?</h2>
            <p className="mt-3 text-muted-foreground">Finish your assessment now — your strengths will plug straight into the generator.</p>
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
