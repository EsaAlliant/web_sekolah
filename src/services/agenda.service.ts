import { createServerClient } from "@/lib/supabase/server";
import type { AgendaEventRow } from "@/types/database";
import type { AgendaEvent } from "@/types/agenda";

function mapRow(row: AgendaEventRow): AgendaEvent {
  return {
    id: row.id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    time: row.time ?? undefined,
    location: row.location,
    category: row.category,
    description: row.description ?? "",
  };
}

export async function getAgenda(): Promise<AgendaEvent[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("agenda_events").select("*").order("start_date");

  if (error) {
    console.error("getAgenda error:", error.message);
    return [];
  }

  return (data as AgendaEventRow[]).map(mapRow);
}

export async function getAgendaById(id: string): Promise<AgendaEvent | undefined> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("agenda_events").select("*").eq("id", id).single();

  if (error || !data) {
    return undefined;
  }

  return mapRow(data as AgendaEventRow);
}
