import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const answersSchema = z.object({
  sessionId: z.string().uuid(),
});

export interface CareerPath {
  title: string;
  match: number;
  why: string;
  salary: { year1: string; year5: string; year10: string };
  lifestyle: string;
  growth: string;
  risks: string;
  firstSteps: string[];
}

export interface CareerResults {
  paths: CareerPath[];
  summary: string;
}

const careerJsonSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    paths: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          match: { type: "number" },
          why: { type: "string" },
          salary: {
            type: "object",
            properties: {
              year1: { type: "string" },
              year5: { type: "string" },
              year10: { type: "string" },
            },
            required: ["year1", "year5", "year10"],
            additionalProperties: false,
          },
          lifestyle: { type: "string" },
          growth: { type: "string" },
          risks: { type: "string" },
          firstSteps: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 5,
          },
        },
        required: ["title", "match", "why", "salary", "lifestyle", "growth", "risks", "firstSteps"],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "paths"],
  additionalProperties: false,
};

export const generateCareerPaths = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => answersSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: session, error: fetchErr } = await supabase
      .from("quiz_sessions")
      .select("id, answers, user_id")
      .eq("id", data.sessionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchErr || !session) {
      return { error: "Session not found", results: null as CareerResults | null };
    }

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      return { error: "AI service not configured", results: null };
    }

    const answers = (session.answers as Record<string, string>) ?? {};
    const userPrompt = `Based on this student's structured self-assessment, generate 3 tailored career paths.

SKILLS THEY'RE GOOD AT:
${answers.skills || "(not provided)"}

SUBJECTS THAT ENERGIZE THEM:
${answers.subjects || "(not provided)"}

TOP PRIORITY (next 5 years):
${answers.priority || "(not provided)"}

WORK STYLE PREFERENCE:
${answers.workstyle || "(not provided)"}

RISK TOLERANCE:
${answers.risk || "(not provided)"}

LOCATION/LIFESTYLE PREFERENCES:
${answers.location || "(not provided)"}

NON-NEGOTIABLES & CONSTRAINTS:
${answers.constraints || "(none specified)"}

Generate 3 distinct career paths that genuinely fit. Be specific, honest about trade-offs, and use real numbers (USD ranges). Match scores 70-95 — never round numbers, no path should be identical. Cover a range: one safer/established, one high-growth, one differentiated.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a structured career analyst. You compare paths honestly with real trade-offs (not motivational fluff). Output strict JSON matching the schema. Be specific and analytical, like a senior career consultant who has done the research.",
          },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "career_paths", strict: true, schema: careerJsonSchema },
        },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const text = await aiResponse.text().catch(() => "");
      console.error("AI gateway error", status, text);
      if (status === 429) return { error: "Rate limit reached. Try again in a moment.", results: null };
      if (status === 402) return { error: "AI credits exhausted. Please add credits in Lovable.", results: null };
      return { error: "Couldn't generate paths. Try again.", results: null };
    }

    const aiJson = await aiResponse.json();
    const content = aiJson?.choices?.[0]?.message?.content;
    if (!content) return { error: "Empty response from AI", results: null };

    let parsed: CareerResults;
    try {
      parsed = JSON.parse(content);
    } catch {
      return { error: "Couldn't parse AI response", results: null };
    }

    const { error: updateErr } = await supabase
      .from("quiz_sessions")
      .update({ career_results: parsed, completed: true })
      .eq("id", data.sessionId);

    if (updateErr) console.error("Failed to save results", updateErr);

    return { error: null, results: parsed };
  });
