import { createServerClient } from "@/lib/supabase/server";
import type { LegalPageSectionRow } from "@/types/database";
import type { LegalPageSlug, LegalSection } from "@/types/legal";

export async function getLegalSections(page: LegalPageSlug): Promise<LegalSection[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("legal_page_sections")
    .select("*")
    .eq("page", page)
    .order("sort_order");

  if (error) {
    console.error(`getLegalSections (${page}) error:`, error.message);
    return [];
  }

  return (data as LegalPageSectionRow[]).map((row) => ({ id: row.id, heading: row.heading, body: row.body }));
}
