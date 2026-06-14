// Shared rule-based translator. Used by /translator single-line tool and Resume Rewriter.

export function extractKeywords(s: string): string[] {
  const words = s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  const stop = new Set([
    "with","that","this","from","were","have","been","into","about","there","their","when","what","just","some","more","they","them","also","than","then","over","very","much","many","most","such","like","other","which","because","while","where","these","those","through","being","both","each","under","after","before","during","without","within","between","across","make","made","work","working","worked","help","helped","helping","organized","managed","team",
  ]);
  return [...new Set(words.filter((w) => !stop.has(w)))].slice(0, 5);
}

export function translate(input: string): string {
  const lower = input.toLowerCase();
  const kws = extractKeywords(input);
  const topic = kws[0] || "the focus area";
  const skill = kws[1] || "core competencies";
  const outcome = kws[2] || "measurable results";
  const context = kws[3] || "a professional setting";

  if (/\b(president|leader|chair|head|captain)\b/.test(lower)) {
    return `Led a cross-functional team of stakeholders, coordinating ${topic}-focused initiatives and managing relationships across ${context} to deliver ${outcome}. Demonstrated leadership, ownership, and the ability to align diverse contributors around shared objectives.`;
  }
  if (/\b(thesis|dissertation|research)\b/.test(lower)) {
    return `Conducted independent research on ${topic}, applying structured ${skill} methodology to identify ${outcome}. Demonstrated strong analytical reasoning, written communication, and the ability to defend findings to expert audiences.`;
  }
  if (/\b(project|assignment|coursework|competition|case)\b/.test(lower)) {
    return `Delivered a ${topic} project under tight constraints, applying ${skill} to achieve ${outcome}. Demonstrated end-to-end ownership, time management, and the ability to translate analysis into actionable recommendations.`;
  }
  if (/\b(intern|internship|placement|trainee)\b/.test(lower)) {
    return `Contributed to the ${topic} function during a structured placement, supporting ${skill} initiatives and developing hands-on experience in ${context}. Built professional credibility and produced ${outcome} valued by the team.`;
  }
  if (/\b(volunteer|community|ngo|charity)\b/.test(lower)) {
    return `Volunteered to support ${topic}-related programs, contributing to ${outcome} while developing transferable ${skill} applicable to ${context}. Demonstrated initiative, civic engagement, and the ability to operate without formal authority.`;
  }
  return `Demonstrated ${skill} through work on ${topic}, delivering ${outcome} and developing transferable competencies applicable to ${context}. Demonstrated initiative, follow-through, and the ability to translate effort into outcomes.`;
}
