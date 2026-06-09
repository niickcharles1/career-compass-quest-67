import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CCNav, CCFooter } from "@/components/cc/Nav";
import { FileText, Languages, ListChecks, RefreshCcw, Check } from "lucide-react";
import { loadAnswers, getVisited } from "@/lib/assessment";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const [name, setName] = useState("");
  const [visited, setVisited] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setName(loadAnswers().name || "");
    setVisited(getVisited());
  }, []);

  const cards = [
    { to: "/results" as const, key: "results", title: "Professional Identity Report", desc: "Your strengths, identity statement, and career fit zones.", Icon: FileText },
    { to: "/translator" as const, key: "translator", title: "Experience Translator", desc: "Convert academic language into employer language.", Icon: Languages },
    { to: "/actions" as const, key: "actions", title: "Action Plan", desc: "Your top 3 highest-leverage actions this week.", Icon: ListChecks },
    { to: "/assessment" as const, key: "assessment", title: "Retake Assessment", desc: "Update your answers as your goals evolve.", Icon: RefreshCcw },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CCNav />
      <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">
          Welcome back{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-2 text-muted-foreground">Your career toolkit, all in one place.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {cards.map(c => (
            <Link
              key={c.to}
              to={c.to}
              className="group block rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:border-[var(--color-teal)] hover:shadow-elevated"
            >
              <c.Icon className="h-7 w-7 text-[var(--color-teal)]" />
              <h3 className="mt-4 text-lg font-bold text-primary">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[var(--color-teal)] group-hover:translate-x-0.5 transition-transform">Go →</span>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-bold text-primary">Your progress</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {cards.map(c => (
              <div key={c.key} className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-sm">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${visited[c.key] ? "bg-[var(--color-teal)] text-white" : "border-2 border-border bg-white"}`}>
                  {visited[c.key] && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className={visited[c.key] ? "font-semibold text-primary" : "text-muted-foreground"}>{c.title}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <CCFooter />
    </div>
  );
}
