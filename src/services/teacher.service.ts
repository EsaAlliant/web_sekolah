import { createServerClient } from "@/lib/supabase/server";
import type { TeacherRow } from "@/types/database";
import type { Teacher } from "@/types/teacher";

function mapRow(row: TeacherRow): Teacher {
  return {
    id: row.id,
    name: row.name,
    nip: row.nip ?? undefined,
    position: row.position,
    subjectGroup: row.subject_group,
    education: row.education,
    email: row.email ?? undefined,
    photoUrl: row.photo_url ?? undefined,
  };
}

export async function getTeachers(): Promise<Teacher[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("teachers").select("*").order("name");

  if (error) {
    console.error("getTeachers error:", error.message);
    return [];
  }

  return (data as TeacherRow[]).map(mapRow);
}

export async function getTeacherById(id: string): Promise<Teacher | undefined> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("teachers").select("*").eq("id", id).single();

  if (error || !data) {
    return undefined;
  }

  return mapRow(data as TeacherRow);
}
