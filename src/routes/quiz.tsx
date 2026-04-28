import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, LogOut } from "lucide-react";
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
      { name: "description", content: "Answer a few structured questions and get your top 3 career paths." },
    ],
  }),
});

const STEPS = [
  {
    key: "skills",
    title: "What are you actually good at?",
    helper: "Be specific. Skip the resume language.",
    type: "textarea" as const,
  },
  {
    key: "subjects",
    title: "Which subjects energize you?",
    helper: "List the topics you'd read about for fun.",
    type: "textarea" as const,
  },
  {
    key: "priority",
    title: "What matters most in the next 5 years?",
    type: "radio" as const,
    options: [
      { value: "income", label: "Income — high earnings early" },
      { value: "stability", label: "Stability — predictable, low-risk path" },
      { value: "impact", label: "Impact — work that meaningfully changes things" },
      { value: "flexibility", label: "Flexibility — control over time and location" },
      { value: "growth", label: "Growth — steep learning curve" },
    ],
  },
  {
    key: "risk",
    title: "How much risk are you comfortable with?",
    type: "radio" as const,
    options: [
      { value: "low", label: "Low — I want a known path" },
      { value: "medium", label: "Medium — calculated bets" },
      { value: "high", label: "High — I'd start something" },
    ],
  },
  {
    key: "constraints",
    title: "Any non-negotiables? (optional)",
    helper: "Location, family, financial obligations, health.",
    type: "textarea" as const,
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
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  // Load existing session
  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("id, answers, current_step, completed")
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
        if (data.completed) {
          // jump to results-aware behaviour later; for now resume at step
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
  }, [user]);

  const persist = useCallback(
    (nextAnswers: Answers, nextStep: number, completed = false) => {
      if (!sessionId) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaving(true);
      saveTimer.current = setTimeout(async () => {
        const { error } = await supabase
          .from("quiz_sessions")
          .update({
            answers: nextAnswers,
            current_step: nextStep,
            completed,
          })
          .eq("id", sessionId);
        setSaving(false);
        if (error) toast.error("Couldn't save your progress");
      }, 500);
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
    } else {
      persist(answers, step, true);
      toast.success("Quiz complete — results coming soon!");
    }
  };

  const goBack = () => {
    if (step > 0) {
      const next = step - 1;
      setStep(next);
      persist(answers, next);
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
  const canAdvance = current.key === "constraints" || value.trim().length > 0;
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
              placeholder="Type your answer…"
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

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" onClick={goBack} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button variant="primary" onClick={goNext} disabled={!canAdvance}>
            {step === STEPS.length - 1 ? "Finish" : "Continue"} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
