import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CCNav, CCFooter } from "@/components/cc/Nav";
import { loadAnswers, markVisited } from "@/lib/assessment";
import { Star, Lightbulb, Target, Compass, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/results")({ component: Results });

function buildIdentity(a: Record<string, any>) {
  const ws: string[] = a.workstyle || [];
  const day = a.goodday || "";
  const strengths: string[] = [...(a.easy || []), ...(a.feedback || [])];
  const motivation = a.matters || "growth";
  const areas: string[] = a.areas || [];
  const risk = a.risk || "Balanced";

  let descriptor = "thoughtful, adaptable";
  if (ws.includes("With people") && day === "Team day") descriptor = "relationship-driven, collaborative";
  else if (ws.includes("Analyzing data") && day === "Deep focus day") descriptor = "analytical, detail-oriented";
  else if (ws.includes("Creating new things") && day === "Variety day") descriptor = "creative, adaptable";
  else if (ws.includes("Leading others")) descriptor = "decisive, people-focused";
  else if (ws.includes("Solving problems")) descriptor = "pragmatic, problem-solving";
  else if (ws.includes("Independently") && day === "Deep focus day") descriptor = "self-directed, focused";
  else if (ws[0]) descriptor = ws[0].toLowerCase();

  const topStrength = strengths[0] || "delivering results";
  const topArea = areas.find(x => x !== "Not sure yet") || "high-impact roles";

  return `You are a ${descriptor} professional who excels at ${topStrength.toLowerCase()} and is driven by ${String(motivation).toLowerCase()}. Your natural style makes you well-suited for roles in ${topArea} where a ${risk.toLowerCase()} approach is valued.`;
}

const STRENGTH_DESCRIPTIONS: Record<string, string> = {
  "Writing & communication": "Clear writing is rare in business — it directly increases your influence.",
  "Numbers & analysis": "Data fluency is one of the most cross-functionally valuable professional skills.",
  "Building relationships": "Long careers are built on trust networks. You start with an advantage.",
  "Organizing & planning": "Operations-minded people are the backbone of every functioning team.",
  "Creative thinking": "Original thinking is what separates execution from real differentiation.",
  "Research & learning": "Fast learners outperform specialists in any rapidly changing industry.",
  "Presenting ideas": "Being able to sell an idea to a room is a senior-level skill — and you have it early.",
  "Managing people or projects": "Project ownership signals leadership readiness to every hiring manager.",
  "Very organized": "Organization compounds — small daily structure leads to large career outcomes.",
  "Creative": "Creativity is the moat against automation. Lean into it.",
  "Great communicator": "Communication is the multiplier on every other skill you have.",
  "Natural leader": "Leadership shows up before titles do — others already see this in you.",
  "Detail-oriented": "Detail is what separates the trustworthy professionals from everyone else.",
  "Strategic thinker": "Strategic thinking gets you out of execution roles faster than anything else.",
  "Reliable": "Reliability is the foundation of every promotion and recommendation you'll ever get.",
  "Good with people": "Interpersonal skill is the highest-paid skill across nearly every industry.",
  "Gets things done": "Bias to action is the trait every employer says they want and few candidates have.",
};

const CHALLENGE_FIXES: Record<string, string> = {
  "Don't know what career path suits me": "Run 3 informational interviews this month to reduce abstract confusion through direct conversation.",
  "Can't explain my value to employers": "Build your 60-second professional story — past, present, future — and rehearse it out loud.",
  "Don't know what actions to prioritize": "Pick one job description, audit your LinkedIn against it, and rewrite to match the keywords.",
  "Lack professional connections": "Send 5 personalized LinkedIn requests per week. Networks compound over time.",
  "Not confident in interviews": "Practice 10 common questions out loud. Confidence comes from reps, not preparation alone.",
  "Overwhelmed by too much career advice": "Limit input. Pick one mentor or framework and execute against it for 30 days.",
  "Worried I've chosen the wrong path": "Most careers are non-linear. Run small experiments before assuming you have to change everything.",
};

const AREA_FITS: Record<string, string> = {
  Consulting: "Structured problem-solving across industries — ideal for analytical generalists.",
  Marketing: "Story, data, and audience — combines creativity with measurable impact.",
  Finance: "Quantitative rigor and high-stakes decisions — rewards precision and discipline.",
  Entrepreneurship: "Total ownership and steep learning curve — for those who prefer ambiguity.",
  Operations: "Make complex systems run smoothly — high leverage, often underrated.",
  "Business Development": "Relationships meet strategy — perfect if you energize from people and deals.",
  "HR & People": "Talent is the most important asset of any company — and the hardest to manage.",
  Strategy: "Long-horizon thinking shaping where a business goes next.",
  Sustainability: "Aligning business goals with planetary and social impact — fast-growing field.",
  Technology: "Build or shape the systems everyone else depends on.",
};

function Results() {
  const [a, setA] = useState<Record<string, any>>({});
  useEffect(() => { setA(loadAnswers()); markVisited("results"); }, []);

  const name = a.name || "there";
  const identity = buildIdentity(a);
  const strengthList: string[] = [...new Set([...(a.easy || []), ...(a.feedback || [])])].slice(0, 3);
  const challenges: string[] = (a.challenges || []).slice(0, 2);
  const areas: string[] = (a.areas || []).filter((x: string) => x !== "Not sure yet").slice(0, 2);
  const notSure = (a.areas || []).includes("Not sure yet") && areas.length === 0;
  const strengthIcons = [Star, Lightbulb, Target];

  return (
    <div className="min-h-screen bg-background">
      <CCNav />
      <main className="mx-auto max-w-4xl px-5 py-10 md:py-14">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[var(--color-teal-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--color-teal)]">
            Based on your 15-question assessment
          </span>
          <h1 className="mt-4 text-3xl font-bold text-primary md:text-5xl">Your Professional Identity Report</h1>
          <p className="mt-3 text-muted-foreground">Here's what we know about you, {name}.</p>
        </div>

        {/* Identity statement */}
        <section className="mt-10 rounded-xl border border-border border-l-4 border-l-primary bg-card p-7 shadow-card md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-teal)]">Your Professional Identity</p>
          <p className="mt-4 text-xl font-medium italic leading-relaxed text-primary md:text-2xl">"{identity}"</p>
        </section>

        {/* Strengths */}
        <section className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-teal)]">Your Core Strengths</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(strengthList.length ? strengthList : ["Adaptability","Curiosity","Drive"]).map((s, i) => {
              const Icon = strengthIcons[i % 3];
              return (
                <div key={s} className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <Icon className="h-6 w-6 text-[var(--color-teal)]" />
                  <h3 className="mt-3 font-bold text-primary">{s}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{STRENGTH_DESCRIPTIONS[s] || "A valuable professional asset that compounds with experience."}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Development */}
        <section className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-teal)]">Where To Focus Next</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {(challenges.length ? challenges : ["Don't know what actions to prioritize","Can't explain my value to employers"]).map((c) => (
              <div key={c} className="rounded-xl border border-border border-l-4 border-l-[var(--color-orange)] bg-card p-5 shadow-card">
                <AlertCircle className="h-5 w-5 text-[var(--color-orange)]" />
                <h3 className="mt-3 font-bold text-primary">{c}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{CHALLENGE_FIXES[c] || "Address this with deliberate weekly action."}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Career fit zones */}
        <section className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-teal)]">Career Directions to Explore</p>
          {notSure ? (
            <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-card">
              <Compass className="h-6 w-6 text-[var(--color-teal)]" />
              <p className="mt-3 text-base text-foreground">You haven't settled on a direction yet — that's okay. Your action plan below is designed to help you explore.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(areas.length ? areas : ["Consulting","Marketing"]).map((area) => (
                <div key={area} className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <span className="inline-block rounded-full bg-[var(--color-teal-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-teal)]">{area}</span>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{AREA_FITS[area] || "A strong fit given your strengths and work style preferences."}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link to="/translator" className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-[var(--color-orange)] px-6 font-semibold text-white shadow-elevated hover:opacity-90">
            Translate My Experience
          </Link>
          <Link to="/actions" className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border-2 border-primary px-6 font-semibold text-primary hover:bg-primary/5">
            See My Action Plan
          </Link>
        </section>
      </main>
      <CCFooter />
    </div>
  );
}
