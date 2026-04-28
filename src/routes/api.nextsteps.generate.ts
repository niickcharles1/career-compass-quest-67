import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export interface NextStepMilestone {
  timeframe: string; // "Next 2 weeks", "Months 1-3", "Months 3-6", "6-12 months", "1-2 years"
  title: string;
  detail: string;
  actions: string[];
}

export interface NextStepsPlan {
  pathTitle: string;
  readiness: number; // 0-100
  readinessSummary: string;
  strengths: string[];
  gaps: string[];
  milestones: NextStepMilestone[];
  resources: { label: string; type: string; why: string }[];
}

const inputSchema = z.object({
  sessionId: z.string().uuid(),
  pathTitle: z.string().min(1).max(200),
  employmentStatus: z.enum([
    "high_school",
    "undergrad",
    "recent_grad",
    "employed_unrelated",
    "employed_related",
    "between_jobs",
    "career_changer",
    "self_employed",
  ]),
  yearsExperience: z.string().max(50),
  currentRole: z.string().max(200).optional().default(""),
  notes: z.string().max(2000).optional().default(""),
  goalTimeframe: z
    .enum(["3_months", "6_months", "12_months", "2_years", "5_years"])
    .optional()
    .default("12_months"),
  primaryGoal: z.string().max(500).optional().default(""),
  targetSalary: z.string().max(50).optional().default(""),
  resumePath: z.string().max(500).optional().nullable(),
  resumeMime: z.string().max(100).optional().nullable(),
});

const planJsonSchema = {
  type: "object",
  properties: {
    pathTitle: { type: "string" },
    readiness: { type: "number" },
    readinessSummary: { type: "string" },
    strengths: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 6,
    },
    gaps: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 6,
    },
    milestones: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          timeframe: { type: "string" },
          title: { type: "string" },
          detail: { type: "string" },
          actions: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 5,
          },
        },
        required: ["timeframe", "title", "detail", "actions"],
        additionalProperties: false,
      },
    },
    resources: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          type: { type: "string" },
          why: { type: "string" },
        },
        required: ["label", "type", "why"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "pathTitle",
    "readiness",
    "readinessSummary",
    "strengths",
    "gaps",
    "milestones",
    "resources",
  ],
  additionalProperties: false,
};

const STATUS_LABELS: Record<string, string> = {
  high_school: "Currently in high school",
  undergrad: "Currently in undergrad",
  recent_grad: "Recent graduate",
  employed_unrelated: "Employed in an unrelated field",
  employed_related: "Employed in a related field",
  between_jobs: "Between jobs",
  career_changer: "Career changer",
  self_employed: "Self-employed / freelancer",
};

const TIMEFRAME_LABELS: Record<string, string> = {
  "3_months": "within 3 months",
  "6_months": "within 6 months",
  "12_months": "within 12 months",
  "2_years": "within 1-2 years",
  "5_years": "within 3-5 years",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk)),
    );
  }
  return btoa(binary);
}

export const Route = createFileRoute("/api/nextsteps/generate")({
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
        const input = parsedInput.data;

        const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: "Bearer " + token } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
        if (claimsErr || !claims?.claims?.sub) {
          return jsonResponse({ error: "Unauthorized" }, 401);
        }
        const userId = claims.claims.sub;

        // Fetch quiz session for context
        const { data: session, error: fetchErr } = await supabase
          .from("quiz_sessions")
          .select("id, answers, career_results, user_id")
          .eq("id", input.sessionId)
          .eq("user_id", userId)
          .maybeSingle();

        if (fetchErr || !session) {
          return jsonResponse({ error: "Session not found" }, 404);
        }

        const answers = (session.answers ?? {}) as Record<string, string>;

        // Optional: fetch resume content
        let resumeText = "";
        let resumePdfBase64: string | null = null;
        if (input.resumePath) {
          // Verify path belongs to the user (folder convention: <userId>/...)
          if (!input.resumePath.startsWith(userId + "/")) {
            return jsonResponse({ error: "Invalid resume path" }, 403);
          }
          const { data: file, error: dlErr } = await supabase.storage
            .from("resumes")
            .download(input.resumePath);

          if (dlErr || !file) {
            console.error("Resume download failed", dlErr);
          } else {
            const buf = new Uint8Array(await file.arrayBuffer());
            const mime = input.resumeMime || file.type || "application/octet-stream";
            if (mime.startsWith("text/") || mime === "application/json") {
              resumeText = new TextDecoder("utf-8", { fatal: false }).decode(buf);
              if (resumeText.length > 30000) resumeText = resumeText.slice(0, 30000);
            } else if (mime === "application/pdf") {
              if (buf.length < 8 * 1024 * 1024) {
                resumePdfBase64 = bytesToBase64(buf);
              } else {
                console.warn("Resume PDF too large, skipping inline");
              }
            } else {
              // DOCX or other: skip — the client should convert or paste text in notes
              console.warn("Unsupported resume mime, skipping:", mime);
            }
          }
        }

        const userPrompt = `A student/professional needs a tailored "Next Steps" plan to break into the career path: "${input.pathTitle}".

THEIR ORIGINAL CAREER QUIZ ANSWERS:
- Skills: ${answers.skills || "(n/a)"}
- Subjects that energize them: ${answers.subjects || "(n/a)"}
- Top priority: ${answers.priority || "(n/a)"}
- Work style: ${answers.workstyle || "(n/a)"}
- Risk tolerance: ${answers.risk || "(n/a)"}
- Location: ${answers.location || "(n/a)"}
- Constraints: ${answers.constraints || "(none)"}

CURRENT SITUATION:
- Status: ${STATUS_LABELS[input.employmentStatus]}
- Years of experience: ${input.yearsExperience || "n/a"}
- Current role/title: ${input.currentRole || "n/a"}
- Additional notes from them: ${input.notes || "(none)"}

THEIR GOALS:
- Target timeframe: ${TIMEFRAME_LABELS[input.goalTimeframe]}
- Target salary: ${input.targetSalary || "(not specified)"}
- Their #1 goal in their own words: ${input.primaryGoal || "(not specified)"}

${resumeText ? `RESUME (text):\n${resumeText}\n` : ""}${resumePdfBase64 ? "(Resume PDF attached as inline data — read it carefully to assess strengths and gaps.)" : ""}

Produce a personalized roadmap to break into "${input.pathTitle}" from where they are TODAY. Be specific and honest. Reflect their actual experience.

- "readiness": realistic 0-100 score of how close they are to entering the field today.
- "readinessSummary": 1-2 sentences explaining the score.
- "strengths": specific things from their background that transfer (cite resume/answers).
- "gaps": specific things they're missing — credentials, skills, experience, network.
- "milestones": 4-6 sequenced milestones from now to landing first role. Each has a timeframe (e.g. "Next 2 weeks", "Months 1-3", "Months 3-6", "6-12 months", "1-2 years"), a title, a detail (1-2 sentences), and 2-5 concrete actions.
- "resources": 3-6 specific recommendations — courses, certifications, communities, books, conferences. Type = one of: course/certification/book/community/event/tool/portfolio.

Tailor every line. Generic advice is a failure.`;

        const userContent: unknown = resumePdfBase64
          ? [
              { type: "text", text: userPrompt },
              {
                type: "image_url",
                image_url: { url: "data:application/pdf;base64," + resumePdfBase64 },
              },
            ]
          : userPrompt;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + LOVABLE_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content:
                  "You are a senior career coach who builds concrete, personalized roadmaps. Honest, specific, no fluff. Output strict JSON matching the schema.",
              },
              { role: "user", content: userContent },
            ],
            response_format: {
              type: "json_schema",
              json_schema: { name: "next_steps_plan", strict: true, schema: planJsonSchema },
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
          return jsonResponse({ error: "Couldn't generate next steps. Try again." }, 502);
        }

        const aiJson = await aiResponse.json();
        const content = aiJson?.choices?.[0]?.message?.content;
        if (!content) return jsonResponse({ error: "Empty response from AI" }, 502);

        let plan: NextStepsPlan;
        try {
          plan = JSON.parse(content);
        } catch {
          return jsonResponse({ error: "Couldn't parse AI response" }, 502);
        }

        return jsonResponse({ plan });
      },
    },
  },
});
