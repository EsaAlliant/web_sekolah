import { createServerClient } from "@/lib/supabase/server";
import type { FaqRow } from "@/types/database";
import type { FaqItem } from "@/types/faq";

export async function getFaq(): Promise<FaqItem[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order");

  if (error) {
    console.error("getFaq error:", error.message);
    return [];
  }

  return (data as FaqRow[]).map((row) => ({ id: row.id, question: row.question, answer: row.answer, category: row.category }));
}
