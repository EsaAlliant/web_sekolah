import { createServerClient } from "@/lib/supabase/server";
import type { HistoryMilestoneRow, HistoryProfileRow, PrincipalProfileRow, VisionMissionRow } from "@/types/database";
import type { HistoryContent, PrincipalContent, VisionMissionContent } from "@/types/about";

export async function getHistory(): Promise<HistoryContent> {
  const supabase = await createServerClient();

  const [{ data: profile, error: profileError }, { data: milestones, error: milestonesError }] = await Promise.all([
    supabase.from("history_profile").select("*").eq("id", 1).single(),
    supabase.from("history_milestones").select("*").order("sort_order"),
  ]);

  if (profileError || milestonesError || !profile) {
    console.error("getHistory error:", profileError?.message ?? milestonesError?.message);
    return { intro: "", milestones: [] };
  }

  const profileRow = profile as HistoryProfileRow;
  return {
    intro: profileRow.intro,
    milestones: (milestones as HistoryMilestoneRow[]).map((row) => ({ year: row.year, title: row.title, description: row.description })),
  };
}

export async function getVisionMission(): Promise<VisionMissionContent> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("vision_mission").select("*").eq("id", 1).single();

  if (error || !data) {
    console.error("getVisionMission error:", error?.message);
    return { vision: "", missions: [], values: [] };
  }

  const row = data as VisionMissionRow;
  return { vision: row.vision, missions: row.missions, values: row.core_values };
}

export async function getPrincipal(): Promise<PrincipalContent> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("principal_profile").select("*").eq("id", 1).single();

  if (error || !data) {
    console.error("getPrincipal error:", error?.message);
    return { name: "", positionPrefix: "", quote: "", emailPrefix: "", messages: [], closing: "" };
  }

  const row = data as PrincipalProfileRow;
  return {
    name: row.name,
    positionPrefix: row.position_prefix,
    quote: row.quote ?? "",
    emailPrefix: row.email_prefix ?? "",
    messages: row.messages,
    closing: row.closing ?? "",
    photoUrl: row.photo_url ?? undefined,
  };
}
