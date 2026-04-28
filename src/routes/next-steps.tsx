import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Compass,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CareerResults, CareerPath } from "./api.career.generate";
import type { NextStepsPlan } from "./api.nextsteps.generate";

export const Route = createFileRoute("/next-steps")({
  component: NextStepsPage,
  head: () => ({
    meta: [
      { title: "Your next steps · Your Choice" },
      {
        name: "description",
        content:
          "Personalized roadmap to break into your chosen career path — based on your current experience and resume.",
      },
    ],
  }),
});

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "high_school", label: "In high school" },
  { value: "undergrad", label: "In undergrad" },
  { value: "recent_grad", label: "Recent graduate" },
  { value: "employed_unrelated", label: "Employed (unrelated field)" },
  { value: "employed_related", label: "Employed (related field)" },
  { value: "between_jobs", label: "Between jobs" },
  { value: "career_changer", label: "Career changer" },
  { value: "self_employed", label: "Self-employed / freelancer" },
];

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_RESUME_BYTES = 8 * 1024 * 1024; // 8MB

function NextStepsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [hydrating, setHydrating] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paths, setPaths] = useState<CareerPath[]>([]);

  // Form state
  const [pathTitle, setPathTitle] = useState<string>("");
  const [employmentStatus, setEmploymentStatus] = useState<string>("undergrad");
  const [yearsExperience, setYearsExperience] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [goalTimeframe, setGoalTimeframe] = useState<string>("12_months");
  const [primaryGoal, setPrimaryGoal] = useState<string>("");
  const [targetSalary, setTargetSalary] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePath, setResumePath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<NextStepsPlan | null>(null);

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
      if (error || !data || !data.completed || !data.career_results) {
        navigate({ to: "/quiz" });
        return;
      }
      const results = data.career_results as unknown as CareerResults;
      setSessionId(data.id);
      setPaths(results.paths);
      setPathTitle(results.paths[0]?.title ?? "");
      setHydrating(false);
    })();
    return () => {
      active = false;
    };
  }, [user, navigate]);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_RESUME_BYTES) return "File is too large (8MB max).";
    const okType =
      ACCEPTED_TYPES.includes(file.type) || /\.(pdf|txt|md|docx?)$/i.test(file.name);
    if (!okType) return "Use PDF, DOC, DOCX, or TXT.";
    return null;
  };

  const uploadFile = useCallback(
    async (file: File) => {
      if (!user) return;
      const err = validateFile(file);
      if (err) {
        setUploadError(err);
        toast.error(err);
        return;
      }
      setUploadError(null);
      setUploading(true);
      setUploadProgress(0);
      setResumeFile(file);

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user.id}/${Date.now()}-${safeName}`;

      try {
        // Get a signed upload URL so we can stream with XHR for real progress
        const { data: signed, error: signErr } = await supabase.storage
          .from("resumes")
          .createSignedUploadUrl(path);
        if (signErr || !signed) throw signErr || new Error("Couldn't get upload URL");

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhrRef.current = xhr;
          xhr.open("PUT", signed.signedUrl, true);
          xhr.setRequestHeader(
            "Content-Type",
            file.type || "application/octet-stream",
          );
          xhr.setRequestHeader("x-upsert", "false");
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) {
              setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Upload failed (${xhr.status})`));
          };
          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.onabort = () => reject(new Error("Upload cancelled"));
          xhr.send(file);
        });

        setResumePath(path);
        setUploadProgress(100);
        toast.success("Resume uploaded.");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        console.error(e);
        if (msg !== "Upload cancelled") {
          setUploadError(msg);
          toast.error(msg);
        }
        setResumeFile(null);
        setResumePath(null);
        setUploadProgress(0);
      } finally {
        xhrRef.current = null;
        setUploading(false);
      }
    },
    [user],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    // Allow re-selecting the same file later
    if (e.target) e.target.value = "";
  };

  const cancelUpload = () => {
    xhrRef.current?.abort();
  };

  const clearResume = async () => {
    cancelUpload();
    if (resumePath) {
      await supabase.storage.from("resumes").remove([resumePath]).catch(() => {});
    }
    setResumeFile(null);
    setResumePath(null);
    setUploadProgress(0);
    setUploadError(null);
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading || resumeFile) return;
    dragCounter.current += 1;
    if (e.dataTransfer?.types?.includes("Files")) setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (uploading || resumeFile) return;
    const file = e.dataTransfer?.files?.[0];
    if (file) void uploadFile(file);
  };

  const canSubmit = useMemo(
    () => !!sessionId && !!pathTitle && !!employmentStatus && !generating && !uploading,
    [sessionId, pathTitle, employmentStatus, generating, uploading],
  );

  const handleGenerate = async () => {
    if (!canSubmit || !sessionId) return;
    setGenerating(true);
    setPlan(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error("Please sign in again.");
        navigate({ to: "/auth" });
        return;
      }
      const res = await fetch("/api/nextsteps/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          sessionId,
          pathTitle,
          employmentStatus,
          yearsExperience,
          currentRole,
          notes,
          goalTimeframe,
          primaryGoal,
          targetSalary,
          resumePath,
          resumeMime: resumeFile?.type ?? null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || "Couldn't generate plan.");
        return;
      }
      setPlan(json.plan as NextStepsPlan);
      // Scroll to plan
      setTimeout(() => {
        document.getElementById("plan-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      toast.error("Network error. Try again.");
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg font-medium">
            Your Choice
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/results">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" /> Back to results
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-12">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">
            Next steps
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Your roadmap to the role
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Tell us where you're starting from. We'll build a tailored plan to break into your
            chosen path — read out of your resume, your current situation, and the path itself.
          </p>
        </div>

        {/* Form */}
        <section className="mt-10 grid gap-8 rounded-xl border border-border bg-card p-6 md:p-8">
          <div>
            <label className="mb-3 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
              1. Pick a career path
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              {paths.map((p) => {
                const active = pathTitle === p.title;
                return (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => setPathTitle(p.title)}
                    className={cn(
                      "rounded-lg border p-4 text-left transition",
                      active
                        ? "border-electric bg-electric/5 ring-1 ring-electric"
                        : "border-border hover:border-foreground/30",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{p.title}</span>
                      {active && <CheckCircle2 className="h-4 w-4 text-electric" />}
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">
                      {p.match}% match
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="2. Current employment status">
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="3. Years of relevant experience">
              <input
                type="text"
                placeholder="e.g. 0, 1-2, 5+"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                maxLength={50}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none"
              />
            </Field>

            <Field label="4. Current role / title (optional)">
              <input
                type="text"
                placeholder="e.g. Junior Marketing Analyst"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                maxLength={200}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none"
              />
            </Field>

            <Field label="5. Anything else we should know? (optional)">
              <textarea
                placeholder="Constraints, location, time commitment, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={2000}
                rows={3}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none"
              />
            </Field>
          </div>

          <div className="rounded-lg border border-dashed border-border bg-background/50 p-5">
            <label className="mb-4 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
              6. Your goals
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Target timeframe">
                <select
                  value={goalTimeframe}
                  onChange={(e) => setGoalTimeframe(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none"
                >
                  <option value="3_months">In 3 months</option>
                  <option value="6_months">In 6 months</option>
                  <option value="12_months">In 12 months</option>
                  <option value="2_years">In 1-2 years</option>
                  <option value="5_years">In 3-5 years</option>
                </select>
              </Field>
              <Field label="Target salary (optional)">
                <input
                  type="text"
                  placeholder="e.g. $80k, €60k"
                  value={targetSalary}
                  onChange={(e) => setTargetSalary(e.target.value)}
                  maxLength={50}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none"
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Your #1 goal in your own words">
                <textarea
                  placeholder="e.g. Land a junior software role at a startup, or transition into UX design at my current company."
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  maxLength={500}
                  rows={2}
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none"
                />
              </Field>
            </div>
          </div>

          <div>
            <label className="mb-3 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
              7. Upload your resume (optional, PDF / DOC / DOCX / TXT, 8MB max)
            </label>

            <div
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              role="region"
              aria-label="Resume upload dropzone"
              className={cn(
                "relative rounded-md border-2 border-dashed bg-background transition",
                isDragging
                  ? "border-electric bg-electric/5"
                  : uploadError
                    ? "border-destructive/60"
                    : "border-border hover:border-foreground/30",
              )}
            >
              {resumeFile ? (
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-5 w-5 shrink-0 text-electric" />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{resumeFile.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {(resumeFile.size / 1024).toFixed(1)} KB
                          {uploading && uploadProgress < 100 && (
                            <> · {uploadProgress}%</>
                          )}
                          {!uploading && resumePath && (
                            <span className="ml-2 inline-flex items-center gap-1 text-emerald-500">
                              <CheckCircle2 className="h-3 w-3" /> Uploaded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={uploading ? cancelUpload : clearResume}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={uploading ? "Cancel upload" : "Remove resume"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {(uploading || (uploadProgress > 0 && uploadProgress < 100)) && (
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={uploadProgress}
                    >
                      <div
                        className="h-full rounded-full bg-electric transition-[width] duration-150 ease-out"
                        style={{ width: uploadProgress + "%" }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={cn(
                    "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md py-10 text-center outline-none",
                    uploading && "pointer-events-none opacity-60",
                  )}
                >
                  <Upload
                    className={cn(
                      "h-6 w-6 transition",
                      isDragging ? "text-electric" : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm font-medium">
                    {isDragging ? "Drop your resume here" : "Drag & drop or click to upload"}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    PDF · DOC · DOCX · TXT — 8MB max
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.txt,.md,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                disabled={uploading}
              />

              {isDragging && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-electric/10 font-mono text-xs uppercase tracking-wider text-electric">
                  Release to upload
                </div>
              )}
            </div>

            {uploadError ? (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                {uploadError}
              </p>
            ) : (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                PDFs and TXT are read directly by the AI. DOC/DOCX are stored but not parsed —
                paste key bullets into the notes field.
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:items-center">
            <Link to="/results" className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </Link>
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={!canSubmit}
              className="min-w-[200px]"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Building your plan…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate next steps
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Plan output */}
        {plan && (
          <PlanSection plan={plan} />
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function PlanSection({ plan }: { plan: NextStepsPlan }) {
  return (
    <motion.section
      id="plan-section"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-12"
    >
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">
              Your plan
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Breaking into {plan.pathTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              {plan.readinessSummary}
            </p>
          </div>
          <ReadinessGauge value={plan.readiness} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ListBlock
            title="Strengths you can lean on"
            tone="positive"
            items={plan.strengths}
          />
          <ListBlock title="Gaps to close" tone="warning" items={plan.gaps} />
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          Milestones
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Sequenced from where you are today to landing your first role.
        </p>
        <ol className="mt-6 space-y-4">
          {plan.milestones.map((m, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-electric/10 font-mono text-xs font-semibold text-electric">
                    {i + 1}
                  </span>
                  <h4 className="font-display text-lg font-semibold">{m.title}</h4>
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {m.timeframe}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{m.detail}</p>
              <ul className="mt-4 space-y-2">
                {m.actions.map((a, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="mt-10">
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          Recommended resources
        </h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plan.resources.map((r, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30"
            >
              <div className="flex items-start gap-2">
                <Compass className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                <div className="font-medium">{r.label}</div>
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {r.type}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.why}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ReadinessGauge({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const tone =
    v >= 70 ? "text-emerald-500" : v >= 40 ? "text-electric" : "text-amber-500";
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
      <div>
        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Readiness
        </div>
        <div className={cn("font-display text-3xl font-semibold leading-none", tone)}>
          {v}
          <span className="text-base text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="h-12 w-px bg-border" />
      <div className="w-28">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full",
              v >= 70 ? "bg-emerald-500" : v >= 40 ? "bg-electric" : "bg-amber-500",
            )}
            style={{ width: v + "%" }}
          />
        </div>
      </div>
    </div>
  );
}

function ListBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "positive" | "warning";
}) {
  const Icon = tone === "positive" ? CheckCircle2 : AlertCircle;
  const color = tone === "positive" ? "text-emerald-500" : "text-amber-500";
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h4 className="font-display text-base font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
