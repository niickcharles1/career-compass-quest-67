# Resume Rewriter — Plan

A new feature added to the **existing `/translator` page** (no other pages changed). Users upload or paste a resume, review each line with side-by-side original vs. business-language rewrite, accept/reject each suggestion, then download a polished PDF.

Uses the **same rule-based translator** already powering the page — no AI cost, instant results.

---

## User flow

1. **Upload step** — On `/translator`, below the existing single-line translator, a new "Resume Rewriter" section appears.
   - Drag-and-drop a **PDF** or **.txt** file, OR paste resume text into a textarea.
   - PDF text is extracted in the browser (no upload to server).
2. **Review step** — Resume is split into lines. Each "rewriteable" line (bullet points, role descriptions) is shown as a card:
   - **Original** (left) vs **Suggested** (right)
   - Buttons: **Keep original** · **Use suggestion** · **Edit manually**
   - Headings, names, dates, contact info are detected and left untouched (shown as non-editable context).
   - Progress indicator: "Reviewing 4 of 18 lines"
   - Prev / Next buttons + "Review all" list view.
3. **Download step** — Once all lines are reviewed (or user clicks "Finish"):
   - Preview of the final resume.
   - **Download PDF** button generates a clean, single-column PDF.
   - **Start over** clears state.

State persists in `localStorage` so a refresh doesn't lose progress.

---

## What gets rewritten vs. what gets preserved

The line classifier decides per-line:

| Line type | Detection | Action |
|---|---|---|
| Name / header | First non-empty line, all caps or title case, no verbs | Preserve |
| Contact info | Contains `@`, phone regex, URL | Preserve |
| Section heading | Short, all caps or ends with `:` (e.g. "EXPERIENCE") | Preserve |
| Date range | Matches month/year patterns | Preserve |
| Job title / company line | Short, no leading bullet, contains `—`, `at`, or `|` | Preserve |
| Bullet / description | Starts with `•`, `-`, `*`, or is a longer sentence | **Rewrite** |

Rewrite engine = the existing `translate()` function from `src/routes/translator.tsx`, extracted into `src/lib/translator.ts` so both the single-line tool and the resume rewriter share it.

---

## Technical plan

### New files
- **`src/lib/translator.ts`** — extracted `translate()` + `extractKeywords()` (pure functions, no React).
- **`src/lib/resumeParser.ts`** — `parseResume(text): ResumeLine[]` with `{ id, raw, type: 'preserve' | 'rewrite', suggestion?: string }`.
- **`src/lib/resumePdf.ts`** — `buildResumePdf(lines): Blob` using **jsPDF** (lightweight, works in browser, no server roundtrip).
- **`src/components/cc/ResumeRewriter.tsx`** — the whole feature as one component: upload → review → download states managed internally.

### Modified files
- **`src/routes/translator.tsx`** — add `<ResumeRewriter />` below the existing CTA card. Refactor inline `translate()` to import from `src/lib/translator.ts` (no behavior change).

### Dependencies to add
- `jspdf` — PDF generation in the browser.
- `pdfjs-dist` — extract text from uploaded PDFs in the browser.

Both are browser-only, no server functions needed. Entire feature runs client-side.

### State shape (in component + localStorage)
```ts
type ResumeLine = {
  id: string;
  raw: string;
  type: 'preserve' | 'rewrite';
  suggestion?: string;     // populated for 'rewrite' lines
  decision?: 'original' | 'suggestion' | 'custom';
  custom?: string;         // if user edited manually
};
type ResumeState = { step: 'upload' | 'review' | 'done'; lines: ResumeLine[]; cursor: number };
```

### PDF output style
- Single column, 11pt body, 16pt name header.
- Preserve section headings as bold caps.
- Bullets rendered with `•` and consistent left indent.
- Filename: `resume-rewritten.pdf`.

---

## What this does NOT touch

- The existing single-line translator UI stays exactly as it is.
- No changes to `/assessment`, `/results`, `/actions`, `/dashboard`, `/`.
- No new routes, no nav changes, no database changes.
- No AI calls, no server functions, no Lovable Cloud usage.

---

## Open assumption (flag for you)

You didn't pick a file-type option, so I'm planning **PDF upload + paste text** as the input methods (covers ~95% of resumes). Add DOCX later if needed — it requires a heavier parser. Let me know if you'd rather start with paste-only to keep it simpler.