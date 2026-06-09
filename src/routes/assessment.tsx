import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CCNav } from "@/components/cc/Nav";
import { loadAnswers, saveAnswers, markVisited } from "@/lib/assessment";

export const Route = createFileRoute("/assessment")({ component: Assessment });

type Q = {
  id: string;
  label: string;
  context?: string;
  type: "text" | "textarea" | "multi" | "single";
  options?: { value: string; desc?: string }[];
  max?: number;
  optional?: boolean;
  placeholder?: string;
};

const QUESTIONS: Q[] = [
  { id: "name", type: "text", label: "What is your name?", context: "We'll use this to personalize your report.", placeholder: "Your name" },
  { id: "degree", type: "text", label: "What degree or program are you studying / did you graduate from?", context: "e.g. Master's in International Management, BSc Business Administration", placeholder: "Your program" },
  { id: "city", type: "text", label: "What city are you based in right now?", placeholder: "City" },
  { id: "workstyle", type: "multi", max: 3, label: "Which of these best describes how you like to work?", context: "Choose 1–3.",
    options: ["With people","Independently","Leading others","Executing plans","Creating new things","Solving problems","Analyzing data","Communicating ideas"].map(v => ({ value: v })) },
  { id: "easy", type: "multi", max: 3, label: "Which subjects or activities have you always found genuinely easy — even when others struggled with them?", context: "Choose up to 3.",
    options: ["Writing & communication","Numbers & analysis","Building relationships","Organizing & planning","Creative thinking","Research & learning","Presenting ideas","Managing people or projects"].map(v => ({ value: v })) },
  { id: "goodday", type: "single", label: "When you imagine a good day at work, what does it look like?",
    options: [
      { value: "Variety day", desc: "Different tasks, people, and challenges every hour" },
      { value: "Deep focus day", desc: "One complex problem, uninterrupted thinking time" },
      { value: "Team day", desc: "Collaborating closely with others toward a shared goal" },
      { value: "Impact day", desc: "Seeing the direct result of your work on real people" },
    ]},
  { id: "areas", type: "multi", max: 3, label: "Which career areas interest you most right now?", context: "Up to 3.",
    options: ["Consulting","Marketing","Finance","Entrepreneurship","Operations","Business Development","HR & People","Strategy","Sustainability","Technology","Not sure yet"].map(v => ({ value: v })) },
  { id: "risk", type: "single", label: "How would you describe your risk tolerance?",
    options: [
      { value: "Stability first", desc: "I want security before I take big swings" },
      { value: "Balanced", desc: "I'm open to risk if the upside is clear" },
      { value: "Growth-oriented", desc: "I'll take calculated risks to grow faster" },
      { value: "All-in", desc: "I'd rather bet on myself than play it safe" },
    ]},
  { id: "matters", type: "single", label: "What matters most to you in your career right now?",
    options: [
      { value: "Learning as fast as possible" },
      { value: "Earning well quickly" },
      { value: "Having real impact on something meaningful" },
      { value: "Building a strong professional network" },
      { value: "Getting international experience" },
    ]},
  { id: "experience", type: "textarea", label: "Describe your most significant academic or extracurricular experience in 2–3 sentences.", context: "Thesis, club leadership, a competition, a major project — anything you're proud of.", placeholder: "Share what you're proud of..." },
  { id: "feedback", type: "multi", max: 3, label: "What kind of feedback do you most often receive from others about your work?", context: "Choose up to 3.",
    options: ["Very organized","Creative","Great communicator","Natural leader","Detail-oriented","Strategic thinker","Reliable","Good with people","Gets things done"].map(v => ({ value: v })) },
  { id: "confidence", type: "single", label: "How confident do you feel communicating your value to employers right now?",
    options: [
      { value: "Not at all", desc: "I wouldn't know where to start" },
      { value: "Slightly", desc: "I know what I've done but struggle to explain why it matters" },
      { value: "Somewhat", desc: "I have a rough idea but it doesn't feel compelling" },
      { value: "Confident", desc: "I can articulate my value clearly and specifically" },
    ]},
  { id: "challenges", type: "multi", label: "Which of these challenges feel most real for you right now?",
    options: ["Don't know what career path suits me","Can't explain my value to employers","Don't know what actions to prioritize","Lack professional connections","Not confident in interviews","Overwhelmed by too much career advice","Worried I've chosen the wrong path"].map(v => ({ value: v })) },
  { id: "time", type: "single", label: "How much time can you realistically commit to career development per week?",
    options: [
      { value: "Less than 1 hour" },
      { value: "1–3 hours" },
      { value: "3–5 hours" },
      { value: "More than 5 hours" },
    ]},
  { id: "specific", type: "textarea", optional: true, label: "Is there anything specific you want Career Compass to help you with?", context: "Optional — skip if nothing comes to mind.", placeholder: "Optional..." },
];

function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(() => loadAnswers());
  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const value = answers[q.id];

  const canProceed = (() => {
    if (q.optional) return true;
    if (q.type === "text" || q.type === "textarea") return typeof value === "string" && value.trim().length > 0;
    if (q.type === "single") return !!value;
    if (q.type === "multi") return Array.isArray(value) && value.length >= 1;
    return false;
  })();

  function setVal(v: any) {
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
    saveAnswers(next);
  }

  function toggleMulti(opt: string) {
    const cur: string[] = Array.isArray(value) ? value : [];
    if (cur.includes(opt)) setVal(cur.filter(x => x !== opt));
    else {
      if (q.max && cur.length >= q.max) return;
      setVal([...cur, opt]);
    }
  }

  function next() {
    if (step === total - 1) {
      markVisited("assessment");
      markVisited("results");
      navigate({ to: "/results" });
    } else {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const progress = ((step + 1) / total) * 100;

  return (
    <div className="min-h-screen bg-background">
      <CCNav />
      <div className="mx-auto max-w-2xl px-5 py-10 md:py-14">
        <div className="mb-2 flex justify-end">
          <span className="text-xs font-semibold text-muted-foreground">Step {step + 1} of {total}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-[var(--color-teal)] transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-6 shadow-card md:p-8">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">{q.label}</h1>
          {q.context && <p className="mt-2 text-sm text-muted-foreground">{q.context}</p>}

          <div className="mt-6">
            {q.type === "text" && (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => setVal(e.target.value)}
                placeholder={q.placeholder}
                className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/30"
                autoFocus
              />
            )}
            {q.type === "textarea" && (
              <textarea
                value={value || ""}
                onChange={(e) => setVal(e.target.value)}
                placeholder={q.placeholder}
                rows={5}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/30"
                autoFocus
              />
            )}
            {q.type === "multi" && (
              <div className="flex flex-wrap gap-2">
                {q.options!.map((o) => {
                  const sel = Array.isArray(value) && value.includes(o.value);
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggleMulti(o.value)}
                      className={`min-h-[44px] rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                        sel
                          ? "border-[var(--color-teal)] bg-[var(--color-teal-soft)] text-[var(--color-teal)]"
                          : "border-border bg-white text-foreground hover:border-primary/40"
                      }`}
                    >
                      {o.value}
                    </button>
                  );
                })}
              </div>
            )}
            {q.type === "single" && (
              <div className="grid gap-3">
                {q.options!.map((o) => {
                  const sel = value === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setVal(o.value)}
                      className={`min-h-[44px] rounded-lg border-2 p-4 text-left transition-all ${
                        sel
                          ? "border-[var(--color-teal)] bg-[var(--color-teal-soft)]"
                          : "border-border bg-white hover:border-primary/40"
                      }`}
                    >
                      <div className="font-semibold text-primary">{o.value}</div>
                      {o.desc && <div className="mt-1 text-sm text-muted-foreground">{o.desc}</div>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="h-12 rounded-lg border-2 border-border px-5 font-semibold text-foreground hover:border-primary/40 disabled:opacity-40"
          >
            Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed}
            className={`h-12 rounded-lg px-6 font-semibold text-white shadow-card disabled:opacity-40 ${
              step === total - 1 ? "bg-[var(--color-orange)]" : "bg-primary"
            }`}
          >
            {step === total - 1 ? "Generate My Results" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
