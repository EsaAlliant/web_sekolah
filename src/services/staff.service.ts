import { createServerClient } from "@/lib/supabase/server";
import type { StaffRow } from "@/types/database";
import type { Staff } from "@/types/staff";

function mapRow(row: StaffRow): Staff {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    unit: row.unit,
    email: row.email ?? undefined,
    photoUrl: row.photo_url ?? undefined,
  };
}

export async function getStaff(): Promise<Staff[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("staff").select("*").order("unit").order("name");

  if (error) {
    console.error("getStaff error:", error.message);
    return [];
  }

  return (data as StaffRow[]).map(mapRow);
}

export async function getStaffById(id: string): Promise<Staff | undefined> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("staff").select("*").eq("id", id).single();

  if (error || !data) {
    return undefined;
  }

  return mapRow(data as StaffRow);
}
