import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut, RefreshCw, TrendingUp, Briefcase, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { CareerResults, CareerPath } from "./api.career.generate";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: "Your top 3 career paths · Your Choice" },
      {
        name: "description",
        content: "Your tailored career map: 3 paths compared with salary, lifestyle, and trade-offs.",
      },
    ],
  }),
});

function ResultsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<CareerResults | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hydrating, setHydrating] = useState(true);
  const [retaking, setRetaking] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("id, career_results, completed")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!active) return;
      if (error || !data) {
        navigate({ to: "/quiz" });
        return;
      }
      if (!data.completed || !data.career_results) {
        navigate({ to: "/quiz" });
        return;
      }
      setSessionId(data.id);
      setResults(data.career_results as unknown as CareerResults);
      setHydrating(false);
    })();
    return () => {
      active = false;
    };
  }, [user, navigate]);

  const handleRetake = async () => {
    if (!user || !sessionId) return;
    setRetaking(true);
    const { error } = await supabase
      .from("quiz_sessions")
      .update({
        completed: false,
        current_step: 0,
        answers: {},
        career_results: null,
      })
      .eq("id", sessionId);
    setRetaking(false);
    if (error) {
      toast.error("Couldn't reset your quiz");
      return;
    }
    navigate({ to: "/quiz" });
  };

  if (loading || hydrating || !results) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg font-medium">
            Your Choice
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleRetake} disabled={retaking}>
              <RefreshCw className="h-4 w-4" /> Retake
            </Button>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">
            Your career map
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Your top 3 paths
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            {results.summary}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {results.paths.map((path, i) => (
            <PathCard key={i} path={path} rank={i + 1} />
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="font-display text-2xl font-semibold">Want to compare differently?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Adjust your answers and re-run to see how different priorities change your top paths.
          </p>
          <Button variant="primary" className="mt-6" onClick={handleRetake} disabled={retaking}>
            {retaking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Resetting…
              </>
            ) : (
              <>
                Retake the quiz <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}

function PathCard({ path, rank }: { path: CareerPath; rank: number }) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          #{rank}
        </span>
        <div className="rounded-full bg-electric/10 px-3 py-1">
          <span className="font-mono text-xs font-semibold text-electric">
            {Math.round(path.match)}% match
          </span>
        </div>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold leading-tight">{path.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{path.why}</p>

      <div className="mt-6 grid grid-cols-3 gap-2 rounded-lg border border-border bg-background p-3">
        {[
          { label: "Year 1", v: path.salary.year1 },
          { label: "Year 5", v: path.salary.year5 },
          { label: "Year 10", v: path.salary.year10 },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 font-display text-sm font-semibold">{s.v}</p>
          </div>
        ))}
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex gap-2">
          <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Lifestyle
            </dt>
            <dd className="mt-0.5 text-foreground">{path.lifestyle}</dd>
          </div>
        </div>
        <div className="flex gap-2">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Growth outlook
            </dt>
            <dd className="mt-0.5 text-foreground">{path.growth}</dd>
          </div>
        </div>
        <div className="flex gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Trade-offs
            </dt>
            <dd className="mt-0.5 text-foreground">{path.risks}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-5 border-t border-border pt-5">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          First steps
        </p>
        <ul className="mt-3 space-y-2">
          {path.firstSteps.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
