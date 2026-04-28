import { supabase } from "@/integrations/supabase/client";
import type { CareerResults } from "@/utils/career.functions";

export async function generateCareerPathsClient(sessionId: string): Promise<{
  error: string | null;
  results: CareerResults | null;
}> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return { error: "Not signed in", results: null };

  const res = await fetch("/_serverFn/career-generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: { sessionId } }),
  });

  // The server function endpoint URL is built by the framework; instead use direct fetch via createServerFn caller.
  if (!res.ok) {
    return { error: "Request failed", results: null };
  }
  return res.json();
}
