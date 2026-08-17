import { createServerClient } from "@/lib/supabase/server";
import type { NewsRow } from "@/types/database";
import type { NewsItem } from "@/types/news";

function mapRow(row: NewsRow): NewsItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    author: row.author ?? "Humas Sekolah",
    date: row.date,
    excerpt: row.excerpt ?? "",
    content: row.content,
    icon: row.icon ?? "bi-newspaper",
    photoUrl: row.photo_url ?? undefined,
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("news").select("*").order("date", { ascending: false });

  if (error) {
    console.error("getNews error:", error.message);
    return [];
  }

  return (data as NewsRow[]).map(mapRow);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("news").select("*").eq("slug", slug).single();

  if (error || !data) {
    return undefined;
  }

  return mapRow(data as NewsRow);
}
