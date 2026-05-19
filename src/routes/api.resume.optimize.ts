import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export interface ResumeOptimization {
  pathTitle: string;
  summary: string; // 2-3 sentence positioning statement tailored to the role
  keywords: string[]; // ATS keywords to include
  changes: { area: string; before: string; after: string; why: string }[];
  optimizedResume: string; // full markdown-formatted resume tailored to the role
  coverLetterDraft: string; // short tailored cover letter
}

const inputSchema = z.object({
  pathTitle: z.string().min(1).max(200),
  resumePath: z.string().min(1).max(500),
  resumeMime: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().default(""),
});

const optimizationSchema = {
  type: "object",
  properties: {
    pathTitle: { type: "string" },
    summary: { type: "string" },
    keywords: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 20 },
    changes: {
      type: "array",
      minItems: 3,
      maxItems: 10,
      items: {
        type: "object",
        properties: {
          area: { type: "string" },
          before: { type: "string" },
          after: { type: "string" },
          why: { type: "string" },
        },
        required: ["area", "before", "after", "why"],
        additionalProperties: false,
      },
    },
    optimizedResume: { type: "string" },
    coverLetterDraft: { type: "string" },
  },
  required: [
    "pathTitle",
    "summary",
    "keywords",
    "changes",
    "optimizedResume",
    "coverLetterDraft",
  ],
  additionalProperties: false,
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

export const Route = createFileRoute("/api/resume/optimize")({
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
        const parsed = inputSchema.safeParse(body);
        if (!parsed.success) {
          return jsonResponse({ error: "Invalid input" }, 400);
        }
        const input = parsed.data;

        const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: "Bearer " + token } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
        if (claimsErr || !claims?.claims?.sub) {
          return jsonResponse({ error: "Unauthorized" }, 401);
        }
        const userId = claims.claims.sub;

        if (!input.resumePath.startsWith(userId + "/")) {
          return jsonResponse({ error: "Invalid resume path" }, 403);
        }

        const { data: file, error: dlErr } = await supabase.storage
          .from("resumes")
          .download(input.resumePath);
        if (dlErr || !file) {
          return jsonResponse({ error: "Couldn't read resume" }, 404);
        }

        const buf = new Uint8Array(await file.arrayBuffer());
        const mime = input.resumeMime || file.type || "application/octet-stream";

        let resumeText = "";
        let resumePdfBase64: string | null = null;
        if (mime.startsWith("text/") || mime === "application/json") {
          resumeText = new TextDecoder("utf-8", { fatal: false }).decode(buf);
          if (resumeText.length > 40000) resumeText = resumeText.slice(0, 40000);
        } else if (mime === "application/pdf") {
          if (buf.length < 8 * 1024 * 1024) {
            resumePdfBase64 = bytesToBase64(buf);
          } else {
            return jsonResponse({ error: "Resume PDF too large" }, 413);
          }
        } else {
          return jsonResponse(
            {
              error:
                "Unsupported resume format for AI optimization. Please upload PDF or TXT.",
            },
            415,
          );
        }

        const prompt = `You are an elite resume writer specialized in tailoring resumes to specific roles. The user wants their resume optimized for this target role:

TARGET ROLE: "${input.pathTitle}"

${input.notes ? `EXTRA CONTEXT FROM USER:\n${input.notes}\n` : ""}
${resumeText ? `RESUME (text):\n${resumeText}\n` : ""}${resumePdfBase64 ? "(Resume PDF attached as inline data — read it carefully.)" : ""}

Rewrite and restructure the resume so it is maximally compelling for "${input.pathTitle}". Rules:
- Keep ALL truthful facts. Do NOT fabricate jobs, dates, degrees, certifications, or metrics.
- Reframe and reword existing experience using the language, verbs, and outcomes that hiring managers in this field care about.
- Surface and amplify the most relevant experience; downplay irrelevant content.
- Add a tailored professional summary at the top.
- Use strong action verbs and quantified outcomes wherever the original implies them.
- Include ATS keywords naturally — never as a dumped list.
- Output the full optimized resume as clean markdown (## sections, - bullets), ready to copy.

Return strict JSON:
- "summary": 2-3 sentence positioning statement aimed at this role.
- "keywords": 5-20 ATS keywords woven into the resume.
- "changes": 3-10 specific before/after edits with a short rationale.
- "optimizedResume": the FULL rewritten resume in markdown.
- "coverLetterDraft": a short (150-220 words) tailored cover letter referencing concrete details from the resume.

Be specific. Generic output is a failure.`;

        const userContent: unknown = resumePdfBase64
          ? [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: "data:application/pdf;base64," + resumePdfBase64 },
              },
            ]
          : prompt;

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
                  "You are an elite resume writer. Honest, specific, ATS-aware. Never invent facts. Output strict JSON matching the schema.",
              },
              { role: "user", content: userContent },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "resume_optimization",
                strict: true,
                schema: optimizationSchema,
              },
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
          return jsonResponse({ error: "Couldn't optimize resume. Try again." }, 502);
        }

        const aiJson = await aiResponse.json();
        const content = aiJson?.choices?.[0]?.message?.content;
        if (!content) return jsonResponse({ error: "Empty response from AI" }, 502);

        let optimization: ResumeOptimization;
        try {
          optimization = JSON.parse(content);
          optimization.pathTitle = input.pathTitle;
        } catch {
          return jsonResponse({ error: "Couldn't parse AI response" }, 502);
        }

        return jsonResponse({ optimization });
      },
    },
  },
});
