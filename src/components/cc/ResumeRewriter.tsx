import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, FileText, ArrowLeft, ArrowRight, Check, X, Pencil, Download, RotateCcw, Sparkles } from "lucide-react";
import { parseResume, rewriteableLines, finalText, type ResumeLine } from "@/lib/resumeParser";
import { buildResumePdf } from "@/lib/resumePdf";

const STORAGE_KEY = "cc:resume-rewriter:v1";
type Step = "upload" | "review" | "done";
type Saved = { step: Step; lines: ResumeLine[]; cursor: number };

async function extractPdfText(file: File): Promise<string> {
  const pdfjs: any = await import("pdfjs-dist");
  // Use a CDN worker to avoid bundler worker config issues
  const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    // Group items into lines by Y position
    const items = content.items as Array<{ str: string; transform: number[] }>;
    const rows = new Map<number, string[]>();
    for (const it of items) {
      const y = Math.round(it.transform[5]);
      if (!rows.has(y)) rows.set(y, []);
      rows.get(y)!.push(it.str);
    }
    const ys = [...rows.keys()].sort((a, b) => b - a);
    for (const y of ys) {
      const line = rows.get(y)!.join(" ").replace(/\s+/g, " ").trim();
      if (line) text += line + "\n";
    }
    text += "\n";
  }
  return text;
}

export function ResumeRewriter() {
  const [step, setStep] = useState<Step>("upload");
  const [lines, setLines] = useState<ResumeLine[]>([]);
  const [cursor, setCursor] = useState(0);
  const [pasteText, setPasteText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const reviewRef = useRef<HTMLDivElement>(null);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s: Saved = JSON.parse(raw);
        if (s.lines?.length) {
          setStep(s.step);
          setLines(s.lines);
          setCursor(s.cursor || 0);
        }
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    if (lines.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, lines, cursor }));
    }
  }, [step, lines, cursor]);

  const rewriteIdxs = useMemo(
    () => lines.map((l, i) => (l.type === "rewrite" ? i : -1)).filter((i) => i >= 0),
    [lines],
  );
  const currentRewriteIdx = rewriteIdxs[cursor];
  const current = currentRewriteIdx != null ? lines[currentRewriteIdx] : undefined;
  const total = rewriteIdxs.length;
  const reviewedCount = useMemo(
    () => rewriteIdxs.filter((i) => lines[i].decision).length,
    [rewriteIdxs, lines],
  );

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      let text = "";
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        text = await extractPdfText(file);
      } else if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
        text = await file.text();
      } else {
        throw new Error("Unsupported file. Please upload a PDF or .txt file, or paste your resume.");
      }
      if (!text.trim()) throw new Error("Could not read any text from this file. Try pasting it instead.");
      startReview(text);
    } catch (e: any) {
      setError(e?.message || "Failed to read file.");
    } finally {
      setLoading(false);
    }
  }

  function startReview(text: string) {
    const parsed = parseResume(text);
    setLines(parsed);
    setCursor(0);
    setStep("review");
    setEditing(false);
    setTimeout(() => reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function decide(decision: "original" | "suggestion" | "custom", custom?: string) {
    if (currentRewriteIdx == null) return;
    setLines((prev) => {
      const next = [...prev];
      next[currentRewriteIdx] = { ...next[currentRewriteIdx], decision, custom };
      return next;
    });
    setEditing(false);
    if (cursor < total - 1) setCursor(cursor + 1);
    else setStep("done");
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setLines([]);
    setCursor(0);
    setStep("upload");
    setPasteText("");
    setError(null);
  }

  async function downloadPdf() {
    const blob = await buildResumePdf(lines);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-rewritten.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-16" ref={reviewRef}>
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-orange)]/10 text-[var(--color-orange)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary">Resume Rewriter</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your full resume and we'll show every bullet in employer language — review one by one, then download a clean PDF.
          </p>
        </div>
      </div>

      {step === "upload" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition ${
              dragOver ? "border-[var(--color-teal)] bg-[var(--color-teal)]/5" : "border-border bg-muted/40"
            }`}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">Drag & drop your resume here</p>
            <p className="text-xs text-muted-foreground">PDF or .txt — processed in your browser, never uploaded</p>
            <label className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:opacity-90">
              {loading ? "Reading…" : "Choose a file"}
              <input
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </label>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or paste <div className="h-px flex-1 bg-border" />
          </div>

          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your full resume here…"
            className="min-h-[160px] w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-[var(--color-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/30"
          />
          <button
            onClick={() => pasteText.trim() && startReview(pasteText)}
            disabled={!pasteText.trim()}
            className="mt-3 h-11 w-full rounded-lg bg-[var(--color-orange)] px-5 font-semibold text-white hover:opacity-90 disabled:opacity-40 md:w-auto md:min-w-[200px]"
          >
            Analyze pasted resume
          </button>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      )}

      {step === "review" && current && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              Reviewing <span className="text-foreground">{cursor + 1}</span> of {total}
              <span className="ml-3 text-xs">({reviewedCount} decided)</span>
            </p>
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3.5 w-3.5" /> Start over
            </button>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-[var(--color-teal)] transition-all" style={{ width: `${((cursor + 1) / total) * 100}%` }} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Your version</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{current.raw}</p>
            </div>
            <div className="rounded-lg border border-[var(--color-teal)]/40 bg-[var(--color-teal)]/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-teal)]">Employer version</p>
              {editing ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="mt-2 min-h-[120px] w-full resize-y rounded border border-input bg-background px-3 py-2 text-sm"
                />
              ) : (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{current.suggestion}</p>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => decide("custom", editValue.trim() || current.suggestion)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:opacity-90"
                >
                  <Check className="h-4 w-4" /> Save edit
                </button>
                <button onClick={() => setEditing(false)} className="h-10 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => decide("original")}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" /> Keep original
                </button>
                <button
                  onClick={() => decide("suggestion")}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-teal)] px-4 text-sm font-semibold text-white hover:opacity-90"
                >
                  <Check className="h-4 w-4" /> Use suggestion
                </button>
                <button
                  onClick={() => { setEditValue(current.suggestion || ""); setEditing(true); }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" /> Edit manually
                </button>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <button
              onClick={() => { setEditing(false); setCursor(Math.max(0, cursor - 1)); }}
              disabled={cursor === 0}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={() => { setEditing(false); if (cursor < total - 1) setCursor(cursor + 1); else setStep("done"); }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {cursor < total - 1 ? <>Skip <ArrowRight className="h-4 w-4" /></> : <>Finish <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => setStep("done")} className="text-xs font-medium text-[var(--color-teal)] hover:underline">
              Skip the rest and go to download →
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-primary">Your rewritten resume is ready</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {reviewedCount} of {total} bullets reviewed. Lines you skipped keep their original wording.
              </p>
            </div>
          </div>

          <div className="mt-5 max-h-80 overflow-y-auto rounded-lg border border-border bg-muted/20 p-4 font-mono text-xs leading-relaxed text-foreground">
            {lines.map((l) => (
              <div key={l.id} className={l.type === "rewrite" && l.decision === "suggestion" ? "text-[var(--color-teal)]" : ""}>
                {finalText(l) || "\u00a0"}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={downloadPdf} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--color-orange)] px-5 font-semibold text-white hover:opacity-90">
              <Download className="h-4 w-4" /> Download PDF
            </button>
            <button onClick={() => { setStep("review"); setCursor(0); }} className="h-11 rounded-lg border border-border px-5 text-sm font-medium hover:bg-muted">
              Back to review
            </button>
            <button onClick={reset} className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border px-5 text-sm font-medium hover:bg-muted">
              <RotateCcw className="h-4 w-4" /> Start over
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
