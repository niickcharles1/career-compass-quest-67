import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { CCNav, CCFooter } from "@/components/cc/Nav";
import { loadAnswers, markVisited } from "@/lib/assessment";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/actions")({ component: Actions });

type Action = { title: string; why: string; time: string; how: string[] };

const ACTION_MAP: Record<string, Action> = {
  "Don't know what career path suits me": {
    title: "Do 3 informational interviews this week",
    why: "The fastest way to reduce career confusion is direct conversation with people already in roles you're curious about. One 20-minute call gives you more clarity than a month of online research.",
    time: "~2 hours total",
    how: [
      "Search LinkedIn for alumni from your university in roles that interest you",
      "Send a short, specific message: 'Hi [name], I'm a [degree] student at [uni] interested in [field]. Would you have 20 minutes for a quick call? I have 3 specific questions.'",
      "Prepare: what do you love/hate about your role, how did you get there, what would you do differently?",
    ],
  },
  "Can't explain my value to employers": {
    title: "Write your 60-second professional story",
    why: "The single most important thing you can do before any interview or networking event is to be able to answer 'tell me about yourself' in a way that's clear, specific, and relevant.",
    time: "~45 minutes",
    how: [
      "Use this structure: Past (where you come from + key experience), Present (what you're focused on now), Future (what you're looking to do next and why)",
      "Practice saying it out loud — it should sound natural, not recited",
      "Use your Career Compass translator output to phrase your experiences professionally",
    ],
  },
  "Don't know what actions to prioritize": {
    title: "Audit your LinkedIn profile against a job description",
    why: "Most students' LinkedIn profiles are generic. Pick one real job posting for a role you'd want and rewrite your headline, summary, and top 3 experience entries to mirror the language in that posting.",
    time: "~1 hour",
    how: [
      "Find 1 job description that genuinely interests you",
      "Identify the 5 most repeated keywords in the posting",
      "Rewrite your headline to include your top 2 relevant keywords",
      "Update your About section to answer: who you are, what you're good at, and what you're looking for",
    ],
  },
  "Lack professional connections": {
    title: "Connect with 5 targeted people on LinkedIn today",
    why: "Professional networks aren't built at career fairs — they're built through small, specific, consistent outreach. Five meaningful connections per week compounds over time.",
    time: "~30 minutes",
    how: [
      "Search alumni from your university using LinkedIn's Alumni tool",
      "Filter by industry or company you're interested in",
      "Send personalized notes — never use the default message",
      "Template: 'Hi [name], I'm a [degree] student at [your school] who's very interested in [their field]. I came across your profile and would love to connect.'",
    ],
  },
};

const DEFAULTS: Action[] = [
  {
    title: "Rewrite your LinkedIn headline today",
    why: "Your headline is the first thing recruiters read. A specific, keyword-rich headline gets you discovered for the right roles.",
    time: "~20 minutes",
    how: [
      "Pick the 2 keywords that describe what you actually want to do",
      "Avoid 'student looking for opportunities' — be specific",
      "Format: [Aspiration / Skill] | [Degree] | [Industry interest]",
    ],
  },
  {
    title: "Send 3 personalised connection requests to alumni",
    why: "Alumni respond to alumni at much higher rates than cold outreach. Three quick personalized notes today can change the next 12 months of your career.",
    time: "~30 minutes",
    how: [
      "Use LinkedIn's Alumni tool — filter by industry",
      "Reference something specific from their profile",
      "Keep it under 4 sentences — ask one clear question",
    ],
  },
  {
    title: "Use the Experience Translator on your top 3 CV points",
    why: "Most students describe their experience in academic language. Translating 3 entries into employer language meaningfully changes how recruiters perceive your CV.",
    time: "~45 minutes",
    how: [
      "Pick your 3 most relevant experiences",
      "Paste each into the Career Compass Translator",
      "Edit the output for accuracy, then replace your CV bullets",
    ],
  },
];

function Actions() {
  const [actions, setActions] = useState<Action[]>([]);
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    markVisited("actions");
    const a = loadAnswers();
    const challenges: string[] = a.challenges || [];
    const matched = challenges.map(c => ACTION_MAP[c]).filter(Boolean) as Action[];
    const filled = [...matched, ...DEFAULTS].slice(0, 3);
    setActions(filled);
  }, []);

  async function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    const { error } = await supabase.from("waitlist").insert({ email: email.trim() });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't sign you up. Try again?");
      return;
    }
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div className="min-h-screen bg-background">
      <CCNav />
      <main className="mx-auto max-w-3xl px-5 py-10 md:py-14">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">Your Top 3 Actions This Week</h1>
        <p className="mt-3 text-muted-foreground">These are the highest-leverage things you can do right now based on your profile.</p>

        <div className="mt-8 grid gap-5">
          {actions.map((act, i) => (
            <article key={i} className="rounded-xl border border-border bg-card p-5 shadow-card md:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">{i + 1}</div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-primary md:text-xl">{act.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{act.why}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <span className="text-xs font-semibold text-[var(--color-teal)]">{act.time}</span>
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                      <input
                        type="checkbox"
                        checked={checked[i] || false}
                        onChange={() => setChecked(prev => prev.map((v, j) => j === i ? !v : v))}
                        className="h-4 w-4 accent-[var(--color-teal)]"
                      />
                      Mark complete
                    </label>
                  </div>
                  <button
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="mt-4 flex w-full items-center justify-between rounded-lg bg-[var(--color-teal-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--color-teal)]"
                  >
                    How to do this
                    <ChevronDown className={`h-4 w-4 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
                  </button>
                  {openIdx === i && (
                    <ul className="mt-3 space-y-2 rounded-lg border border-border bg-background p-4 text-sm text-foreground">
                      {act.how.map((h, k) => (
                        <li key={k} className="flex gap-2">
                          <span className="text-[var(--color-teal)]">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Monthly goals */}
        <section className="mt-10 rounded-xl bg-muted p-6">
          <h3 className="text-lg font-bold text-primary">Your 30-Day Focus Areas</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Build your professional story","Expand your network by 20+","Complete the Experience Translator","Apply to 3 targeted roles"].map(g => (
              <span key={g} className="rounded-full bg-[var(--color-teal-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-teal)]">{g}</span>
            ))}
          </div>
        </section>

        {/* Waitlist CTA */}
        <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-card md:p-8">
          <h3 className="text-2xl font-bold text-primary">Want to go deeper?</h3>
          <p className="mt-2 text-muted-foreground">
            Career Compass is growing. Sign up to get notified when we launch alumni connections, AI interview coaching, and portfolio building.
          </p>
          {submitted ? (
            <p className="mt-5 rounded-lg bg-[var(--color-teal-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-teal)]">
              You're on the list. We'll be in touch.
            </p>
          ) : (
            <form onSubmit={joinWaitlist} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 flex-1 rounded-lg border border-input bg-background px-4 text-base focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/30"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-12 rounded-lg bg-[var(--color-orange)] px-6 font-semibold text-white shadow-card hover:opacity-90 disabled:opacity-40"
              >
                {submitting ? "..." : "Notify Me"}
              </button>
            </form>
          )}
        </section>
      </main>
      <CCFooter />
    </div>
  );
}
