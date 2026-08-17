import { createServerClient } from "@/lib/supabase/server";

export interface VisitorStats { today: string; month: string; year: string; total: string; }

function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const supabase = await createServerClient();
  const now = new Date();

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();

  const [today, month, year, total] = await Promise.all([
    supabase.from("page_visits").select("*", { count: "exact", head: true }).gte("visited_at", startOfDay),
    supabase.from("page_visits").select("*", { count: "exact", head: true }).gte("visited_at", startOfMonth),
    supabase.from("page_visits").select("*", { count: "exact", head: true }).gte("visited_at", startOfYear),
    supabase.from("page_visits").select("*", { count: "exact", head: true }),
  ]);

  return {
    today: formatNumber(today.count ?? 0),
    month: formatNumber(month.count ?? 0),
    year: formatNumber(year.count ?? 0),
    total: formatNumber(total.count ?? 0),
  };
}
