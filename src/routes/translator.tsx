import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CCNav, CCFooter } from "@/components/cc/Nav";
import { Copy, Check } from "lucide-react";
import { markVisited } from "@/lib/assessment";
import { translate } from "@/lib/translator";
import { ResumeRewriter } from "@/components/cc/ResumeRewriter";

export const Route = createFileRoute("/translator")({ component: Translator });

const EXAMPLES: Record<string, string> = {
  "Student club president": "Student Committee President — organized weekly events and managed a team of 8 volunteers for the International Students Association",
  "Thesis project on sustainability": "Wrote my bachelor thesis on the impact of corporate ESG strategy on consumer trust in the European retail sector",
  "Marketing internship": "Marketing intern at a small SaaS company — helped run social media and wrote some blog posts about our product features",
  "Erasmus semester": "Did an Erasmus exchange semester in Lisbon studying International Business and worked on a group project about market entry",
  "Academic competition finalist": "Reached the final of a national business case competition with a team of 4, presenting a market entry strategy for a retail brand",
};


function Translator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { markVisited("translator"); }, []);

  function handleTranslate() {
    if (!input.trim()) return;
    setOutput(translate(input.trim()));
    setCopied(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function reset() {
    setInput("");
    setOutput("");
  }

  return (
    <div className="min-h-screen bg-background">
      <CCNav />
      <main className="mx-auto max-w-3xl px-5 py-10 md:py-14">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">Experience Translator</h1>
        <p className="mt-3 text-muted-foreground">
          Paste any academic description below — a role, project, coursework, or achievement — and we'll rewrite it in the language employers actually respond to.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-card md:p-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 'Student Committee President — organized weekly events and managed a team of 8 volunteers for the International Students Association'"
            className="min-h-[140px] w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-base focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/30"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.keys(EXAMPLES).map((label) => (
              <button
                key={label}
                onClick={() => setInput(EXAMPLES[label])}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-[var(--color-teal)] hover:text-[var(--color-teal)]"
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleTranslate}
            disabled={!input.trim()}
            className="mt-4 h-12 w-full rounded-lg bg-[var(--color-orange)] px-6 font-semibold text-white shadow-card hover:opacity-90 disabled:opacity-40 md:w-auto md:min-w-[180px]"
          >
            Translate
          </button>
        </div>

        {output && (
          <div className="mt-6 rounded-xl border border-border border-t-4 border-t-[var(--color-teal)] bg-card p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-teal)]">Employer Version</p>
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-foreground">{output}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={handleCopy} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground hover:bg-muted">
                {copied ? <Check className="h-4 w-4 text-[var(--color-teal)]" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy to clipboard"}
              </button>
              <button onClick={reset} className="text-sm font-medium text-[var(--color-teal)] hover:underline">Try another</button>
            </div>
          </div>
        )}

        {/* Academic phrases table */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-primary">Common Academic Phrases to Avoid</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="grid grid-cols-2 border-b border-border bg-muted text-sm font-semibold">
              <div className="bg-red-50 px-4 py-3 text-red-700">Academic language</div>
              <div className="bg-green-50 px-4 py-3 text-green-700">Employer language</div>
            </div>
            {[
              ["Studied X", "Applied X to solve [problem]"],
              ["Participated in", "Contributed to / Led"],
              ["Was responsible for", "Owned and delivered"],
              ["Helped with", "Collaborated to achieve"],
              ["Got good grades in", "Demonstrated mastery of"],
              ["Did a presentation on", "Communicated [findings] to [audience]"],
              ["Completed a project", "Delivered [outcome] under [constraints]"],
            ].map(([a, b]) => (
              <div key={a} className="grid grid-cols-2 border-b border-border last:border-b-0 text-sm">
                <div className="px-4 py-3 text-muted-foreground">{a}</div>
                <div className="px-4 py-3 font-medium text-foreground">{b}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-xl bg-primary p-7 text-center text-white shadow-elevated">
          <h3 className="text-xl font-bold">Ready for your action plan?</h3>
          <Link to="/actions" className="mt-5 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--color-orange)] px-6 font-semibold text-white hover:opacity-90">
            See My Top 3 Actions
          </Link>
        </div>
      </main>
      <CCFooter />
    </div>
  );
}
