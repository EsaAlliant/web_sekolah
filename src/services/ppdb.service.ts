import { createServerClient } from "@/lib/supabase/server";
import type { PpdbInfoRow } from "@/types/database";
import type { PpdbInfo } from "@/types/ppdb";

export async function getPpdbInfo(): Promise<PpdbInfo> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("ppdb_info").select("*").eq("id", 1).single();

  if (error || !data) {
    console.error("getPpdbInfo error:", error?.message);
    return { period: "", status: "draft", quota: "", fee: "", requirements: [], timeline: [], steps: [] };
  }

  const row = data as PpdbInfoRow;
  return {
    period: row.period,
    status: row.status,
    quota: row.quota ?? "",
    fee: row.fee ?? "",
    requirements: row.requirements,
    timeline: row.timeline,
    steps: row.steps,
  };
}
