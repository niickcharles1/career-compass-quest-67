import { finalText, type ResumeLine } from "./resumeParser";

const HEADING_WORDS = /^(experience|education|skills|projects|summary|profile|objective|certifications?|awards?|publications?|languages?|interests?|references?|volunteer(ing)?|leadership|activities|work experience|professional experience|technical skills|achievements?)\s*:?\s*$/i;

function isHeading(t: string): boolean {
  const s = t.trim();
  if (!s) return false;
  if (HEADING_WORDS.test(s)) return true;
  if (s.length <= 30 && s === s.toUpperCase() && /[A-Z]/.test(s) && !/[.!?]/.test(s)) return true;
  if (s.length <= 40 && s.endsWith(":")) return true;
  return false;
}

export async function buildResumePdf(lines: ResumeLine[]): Promise<Blob> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 54;
  const marginY = 54;
  const maxWidth = pageWidth - marginX * 2;
  let y = marginY;
  let firstNonEmptySeen = false;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginY) {
      doc.addPage();
      y = marginY;
    }
  };

  for (const line of lines) {
    const text = finalText(line);
    const trimmed = text.trim();

    if (!trimmed) {
      y += 6;
      continue;
    }

    // First non-empty line: treat as name header
    if (!firstNonEmptySeen) {
      firstNonEmptySeen = true;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const wrapped = doc.splitTextToSize(trimmed, maxWidth);
      ensureSpace(22 * wrapped.length);
      doc.text(wrapped, marginX, y);
      y += 22 * wrapped.length + 4;
      continue;
    }

    if (isHeading(trimmed)) {
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      const upper = trimmed.replace(/:$/, "").toUpperCase();
      ensureSpace(18);
      doc.text(upper, marginX, y);
      // underline
      const w = doc.getTextWidth(upper);
      doc.setDrawColor(180);
      doc.line(marginX, y + 2, marginX + w, y + 2);
      y += 14;
      continue;
    }

    const isBullet = /^\s*•\s+/.test(text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    if (isBullet) {
      const body = text.replace(/^\s*•\s+/, "");
      const indent = 14;
      const wrapped = doc.splitTextToSize(body, maxWidth - indent);
      ensureSpace(14 * wrapped.length);
      doc.text("•", marginX, y);
      doc.text(wrapped, marginX + indent, y);
      y += 14 * wrapped.length + 2;
    } else {
      const wrapped = doc.splitTextToSize(trimmed, maxWidth);
      ensureSpace(14 * wrapped.length);
      doc.text(wrapped, marginX, y);
      y += 14 * wrapped.length + 2;
    }
  }

  return doc.output("blob");
}
