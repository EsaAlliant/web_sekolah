import { createServerClient } from "@/lib/supabase/server";
import type { CurriculumProfileRow, MajorRow } from "@/types/database";
import type { CurriculumContent, Major } from "@/types/academic";

function mapMajor(row: MajorRow): Major {
  return {
    id: row.id,
    name: row.name,
    abbreviation: row.abbreviation,
    description: row.description,
    duration: row.duration,
    icon: row.icon ?? "bi-mortarboard",
    competencies: row.competencies,
    careerPaths: row.career_paths,
  };
}

export async function getMajors(): Promise<Major[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("majors").select("*").order("sort_order");

  if (error) {
    console.error("getMajors error:", error.message);
    return [];
  }

  return (data as MajorRow[]).map(mapMajor);
}

export async function getMajorById(id: string): Promise<Major | undefined> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("majors").select("*").eq("id", id).single();

  if (error || !data) {
    return undefined;
  }

  return mapMajor(data as MajorRow);
}

export async function getCurriculum(): Promise<CurriculumContent> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("curriculum_profile").select("*").eq("id", 1).single();

  if (error || !data) {
    console.error("getCurriculum error:", error?.message);
    return { framework: "", intro: "", profile: { curriculumName: "", schedule: "", dataSemester: "", internetAccess: "", electricitySource: "", electricityPower: "", landArea: "" }, components: [], structure: [] };
  }

  const row = data as CurriculumProfileRow;
  return {
    framework: row.framework,
    intro: row.intro ?? "",
    profile: {
      curriculumName: row.curriculum_name ?? "",
      schedule: row.schedule ?? "",
      dataSemester: row.data_semester ?? "",
      internetAccess: row.internet_access ?? "",
      electricitySource: row.electricity_source ?? "",
      electricityPower: row.electricity_power ?? "",
      landArea: row.land_area ?? "",
    },
    components: row.components,
    structure: row.structure,
  };
}
