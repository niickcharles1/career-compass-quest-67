import { translate } from "./translator";

export type ResumeLine = {
  id: string;
  raw: string;
  type: "preserve" | "rewrite";
  suggestion?: string;
  decision?: "original" | "suggestion" | "custom";
  custom?: string;
};

const DATE_RE = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\b.*\d{2,4}|\b(19|20)\d{2}\b\s*[-–—to]+\s*((19|20)\d{2}|present|current)/i;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const URL_RE = /\b(https?:\/\/|www\.|linkedin\.com|github\.com)\S+/i;
const BULLET_RE = /^\s*[•\-\*▪◦·●○]\s+/;
const HEADING_WORDS = /^(experience|education|skills|projects|summary|profile|objective|certifications?|awards?|publications?|languages?|interests?|references?|volunteer(ing)?|leadership|activities|work experience|professional experience|technical skills|achievements?)\s*:?\s*$/i;

function looksLikeHeading(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (HEADING_WORDS.test(t)) return true;
  if (t.length <= 30 && t === t.toUpperCase() && /[A-Z]/.test(t) && !/[.!?]/.test(t)) return true;
  if (t.length <= 40 && t.endsWith(":")) return true;
  return false;
}

function looksLikeContact(line: string): boolean {
  return EMAIL_RE.test(line) || PHONE_RE.test(line) || URL_RE.test(line);
}

function looksLikeDate(line: string): boolean {
  return DATE_RE.test(line);
}

function looksLikeRoleHeader(line: string, idx: number): boolean {
  const t = line.trim();
  if (idx < 3 && t.length <= 60 && !/[.!?]/.test(t)) return true; // name/header area
  // short line with separator suggesting "Role — Company" or "Role | Company"
  if (t.length <= 90 && /[—|–]/.test(t) && t.split(/\s+/).length <= 12 && !BULLET_RE.test(line)) return true;
  return false;
}

function classify(line: string, idx: number): "preserve" | "rewrite" {
  const t = line.trim();
  if (!t) return "preserve";
  if (looksLikeContact(t)) return "preserve";
  if (looksLikeHeading(t)) return "preserve";
  if (looksLikeDate(t)) return "preserve";
  if (looksLikeRoleHeader(t, idx)) return "preserve";
  // very short fragments (single word, etc.) — preserve
  if (t.split(/\s+/).length < 4) return "preserve";
  return "rewrite";
}

export function parseResume(text: string): ResumeLine[] {
  const rawLines = text.split(/\r?\n/);
  const result: ResumeLine[] = [];
  let id = 0;
  rawLines.forEach((line, idx) => {
    const type = classify(line, idx);
    const entry: ResumeLine = {
      id: `l${id++}`,
      raw: line,
      type,
    };
    if (type === "rewrite") {
      // strip leading bullet char for translation but remember it
      const cleaned = line.replace(BULLET_RE, "").trim();
      entry.suggestion = translate(cleaned);
    }
    result.push(entry);
  });
  return result;
}

export function rewriteableLines(lines: ResumeLine[]): ResumeLine[] {
  return lines.filter((l) => l.type === "rewrite");
}

export function finalText(line: ResumeLine): string {
  if (line.type === "preserve") return line.raw;
  const bulletMatch = line.raw.match(BULLET_RE);
  const prefix = bulletMatch ? bulletMatch[0] : "";
  const indent = line.raw.match(/^\s*/)?.[0] ?? "";
  let body: string;
  if (line.decision === "suggestion") body = line.suggestion ?? line.raw;
  else if (line.decision === "custom") body = line.custom ?? line.raw;
  else body = line.raw.replace(BULLET_RE, "").trim();
  if (prefix) return `${indent}• ${body}`;
  return body;
}
