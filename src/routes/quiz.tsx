import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  head: () => ({
    meta: [
      { title: "Your career quiz · Your Choice" },
      {
        name: "description",
        content:
          "Answer a few structured questions and get your top 3 career paths with real trade-offs.",
      },
    ],
  }),
});

type Step = {
  key: string;
  title: string;
  helper?: string;
  type: "textarea" | "radio";
  placeholder?: string;
  options?: { value: string; label: string }[];
  optional?: boolean;
};

const STEPS: Step[] = [
  {
    key: "skills",
    title: "What are you actually good at?",
    helper: "Be specific. Skip resume language — write like you'd tell a friend.",
    type: "textarea",
    placeholder: "e.g. Breaking down hard topics so other people get them, fast pattern-spotting in data, calm under deadline pressure…",
  },
  {
    key: "subjects",
    title: "Which subjects or topics energize you?",
    helper: "What would you read about for fun on a Sunday?",
    type: "textarea",
    placeholder: "e.g. Behavioral economics, climate tech, design systems, neuroscience, history of finance…",
  },
  {
    key: "priority",
    title: "What matters most in the next 5 years?",
    type: "radio",
    options: [
      { value: "income", label: "Income — high earnings early" },
      { value: "stability", label: "Stability — predictable, low-risk path" },
      { value: "impact", label: "Impact — work that meaningfully changes things" },
      { value: "flexibility", label: "Flexibility — control over time and location" },
      { value: "growth", label: "Growth — steep learning curve" },
    ],
  },
  {
    key: "workstyle",
    title: "How do you prefer to work?",
    type: "radio",
    options: [
      { value: "deep_solo", label: "Deep solo work — long focused stretches" },
      { value: "small_team", label: "Tight small team — close collaboration" },
      { value: "people_facing", label: "People-facing — meetings, clients, stakeholders" },
      { value: "build_ship", label: "Build & ship — making things others use" },
    ],
  },
  {
    key: "risk",
    title: "How much risk are you comfortable with?",
    type: "radio",
    options: [
      { value: "low", label: "Low — I want a known, well-trodden path" },
      { value: "medium", label: "Medium — calculated bets on the side" },
      { value: "high", label: "High — I'd start something or join a startup" },
    ],
  },
  {
    key: "location",
    title: "Where do you want to live and work?",
    helper: "Remote, specific city, willing to move for the right role?",
    type: "textarea",
    placeholder: "e.g. Remote-first, open to NYC or SF for 2-3 years, eventually back to Europe…",
    optional: true,
  },
  {
    key: "constraints",
    title: "Any non-negotiables? (optional)",
    helper: "Family obligations, financial constraints, health, visa status, anything that limits options.",
    type: "textarea",
    placeholder: "e.g. Need to support family financially within 2 years, no relocation outside the EU…",
    optional: true,
  },
];

type Answers = Record<string, string>;

function QuizPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [hydrating, setHydrating] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("id, answers, current_step, completed, career_results")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!active) return;
      if (error) {
        toast.error("Couldn't load your saved progress");
        setHydrating(false);
        return;
      }
      if (data) {
        setSessionId(data.id);
        setAnswers((data.answers as Answers) ?? {});
        setStep(Math.min(data.current_step ?? 0, STEPS.length - 1));
        if (data.completed && data.career_results) {
          navigate({ to: "/results" });
          return;
        }
      } else {
        const { data: created, error: createErr } = await supabase
          .from("quiz_sessions")
          .insert({ user_id: user.id, answers: {}, current_step: 0 })
          .select("id")
          .single();
        if (createErr) toast.error("Couldn't start a new session");
        else setSessionId(created.id);
      }
      setHydrating(false);
    })();
    return () => {
      active = false;
    };
  }, [user, navigate]);

  const persist = useCallback(
    (nextAnswers: Answers, nextStep: number) => {
      if (!sessionId) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaving(true);
      saveTimer.current = setTimeout(async () => {
        const { error } = await supabase
          .from("quiz_sessions")
          .update({ answers: nextAnswers, current_step: nextStep })
          .eq("id", sessionId);
        setSaving(false);
        if (error) toast.error("Couldn't save your progress");
      }, 500);
    },
    [sessionId],
  );

  const flushSave = useCallback(
    async (nextAnswers: Answers, nextStep: number) => {
      if (!sessionId) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaving(true);
      const { error } = await supabase
        .from("quiz_sessions")
        .update({ answers: nextAnswers, current_step: nextStep })
        .eq("id", sessionId);
      setSaving(false);
      if (error) throw error;
    },
    [sessionId],
  );

  const updateAnswer = (key: string, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    persist(next, step);
  };

  const goNext = () => {
    if (step < STEPS.length - 1) {
      const next = step + 1;
      setStep(next);
      persist(answers, next);
    }
  };

  const goBack = () => {
    if (step > 0) {
      const next = step - 1;
      setStep(next);
      persist(answers, next);
    }
  };

  const handleGenerate = async () => {
    if (!sessionId) return;
    setGenerating(true);
    try {
      await flushSave(answers, step);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        toast.error("Session expired — please sign in again");
        navigate({ to: "/auth" });
        return;
      }
      const res = await fetch("/api/career/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        toast.error(json.error || "Couldn't generate your paths");
        return;
      }
      navigate({ to: "/results" });
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading || hydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const current = STEPS[step];
  const value = answers[current.key] ?? "";
  const canAdvance = current.optional || value.trim().length > 0;
  const isLast = step === STEPS.length - 1;
  const allRequiredAnswered = STEPS.every(
    (s) => s.optional || (answers[s.key] ?? "").trim().length > 0,
  );
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg font-medium">
            Your Choice
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="flex items-center gap-1.5">
              {saving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Saving
                </>
              ) : (
                <>
                  <Check className="h-3 w-3 text-electric" /> Saved
                </>
              )}
            </span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-electric transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {current.title}
        </h1>
        {current.helper && (
          <p className="mt-2 text-sm text-muted-foreground">{current.helper}</p>
        )}

        <div className="mt-8">
          {current.type === "textarea" ? (
            <Textarea
              value={value}
              onChange={(e) => updateAnswer(current.key, e.target.value.slice(0, 1000))}
              placeholder={current.placeholder ?? "Type your answer…"}
              rows={5}
              className="text-base"
            />
          ) : (
            <RadioGroup
              value={value}
              onValueChange={(v) => updateAnswer(current.key, v)}
              className="space-y-2"
            >
              {current.options?.map((opt) => (
                <Label
                  key={opt.value}
                  htmlFor={`${current.key}-${opt.value}`}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-electric/40 has-[:checked]:border-electric has-[:checked]:bg-electric/5"
                >
                  <RadioGroupItem id={`${current.key}-${opt.value}`} value={opt.value} />
                  <span className="text-sm font-medium">{opt.label}</span>
                </Label>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={goBack} disabled={step === 0 || generating}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {isLast ? (
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={!allRequiredAnswered || generating}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your fit…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate my top 3 paths
                </>
              )}
            </Button>
          ) : (
            <Button variant="primary" onClick={goNext} disabled={!canAdvance || generating}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isLast && !allRequiredAnswered && (
          <p className="mt-4 text-right text-xs text-muted-foreground">
            A few earlier questions are still empty. Go back and complete them to get accurate
            results.
          </p>
        )}
      </main>
    </div>
  );
}
