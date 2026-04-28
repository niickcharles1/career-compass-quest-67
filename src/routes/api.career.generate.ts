import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

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

const inputSchema = z.object({
  sessionId: z.string().uuid(),
});

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

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/career/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return jsonResponse({ error: "Server misconfigured" }, 500);
        }
        if (!LOVABLE_API_KEY) {
          return jsonResponse({ error: "AI service not configured" }, 500);
        }

        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return jsonResponse({ error: "Unauthorized" }, 401);
        }
        const token = authHeader.replace("Bearer ", "");

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ error: "Invalid JSON" }, 400);
        }
        const parsedInput = inputSchema.safeParse(body);
        if (!parsedInput.success) {
          return jsonResponse({ error: "Invalid input" }, 400);
        }

        const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
        if (claimsErr || !claims?.claims?.sub) {
          return jsonResponse({ error: "Unauthorized" }, 401);
        }
        const userId = claims.claims.sub;

        const { data: session, error: fetchErr } = await supabase
          .from("quiz_sessions")
          .select("id, answers, user_id")
          .eq("id", parsedInput.data.sessionId)
          .eq("user_id", userId)
          .maybeSingle();

        if (fetchErr || !session) {
          return jsonResponse({ error: "Session not found" }, 404);
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

Generate 3 distinct career paths that genuinely fit. Be specific, honest about trade-offs, and use real numbers (USD ranges). Match scores 70-95 — never identical, no path should look the same. Cover a range: one safer/established, one high-growth, one differentiated.`;

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
          if (status === 429)
            return jsonResponse({ error: "Rate limit reached. Try again in a moment." }, 429);
          if (status === 402)
            return jsonResponse(
              { error: "AI credits exhausted. Please add credits in Lovable." },
              402,
            );
          return jsonResponse({ error: "Couldn't generate paths. Try again." }, 502);
        }

        const aiJson = await aiResponse.json();
        const content = aiJson?.choices?.[0]?.message?.content;
        if (!content) return jsonResponse({ error: "Empty response from AI" }, 502);

        let parsed: CareerResults;
        try {
          parsed = JSON.parse(content);
        } catch {
          return jsonResponse({ error: "Couldn't parse AI response" }, 502);
        }

        const { error: updateErr } = await supabase
          .from("quiz_sessions")
          .update({
            career_results: parsed as unknown as never,
            completed: true,
          })
          .eq("id", parsedInput.data.sessionId);

        if (updateErr) console.error("Failed to save results", updateErr);

        return jsonResponse({ results: parsed });
      },
    },
  },
});
