import { createServerClient } from "@/lib/supabase/server";
import type { FacilityRow } from "@/types/database";
import type { Facility } from "@/types/facility";

export async function getFacilities(): Promise<Facility[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("facilities").select("*").order("sort_order");

  if (error) {
    console.error("getFacilities error:", error.message);
    return [];
  }

  return (data as FacilityRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    icon: row.icon ?? "bi-building",
    photoUrl: row.photo_url ?? undefined,
  }));
}
