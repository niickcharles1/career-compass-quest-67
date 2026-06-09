export type Answers = Record<string, any>;

export const STORAGE_KEY = "cc_answers";
export const VISITED_KEY = "cc_visited";

export function loadAnswers(): Answers {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
export function saveAnswers(a: Answers) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
}
export function markVisited(page: string) {
  if (typeof window === "undefined") return;
  try {
    const v = JSON.parse(localStorage.getItem(VISITED_KEY) || "{}");
    v[page] = true;
    localStorage.setItem(VISITED_KEY, JSON.stringify(v));
  } catch {}
}
export function getVisited(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(VISITED_KEY) || "{}"); } catch { return {}; }
}
