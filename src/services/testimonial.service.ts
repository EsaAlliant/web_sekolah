import { createServerClient } from "@/lib/supabase/server";
import type { TestimonialRow } from "@/types/database";
import type { Testimonial } from "@/types/testimonial";

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("getTestimonials error:", error.message);
    return [];
  }

  return (data as TestimonialRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    detail: row.detail ?? "",
    quote: row.quote ?? "",
    photoUrl: row.photo_url ?? undefined,
    videoUrl: row.video_url ?? undefined,
  }));
}
