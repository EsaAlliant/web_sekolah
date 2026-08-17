import { createServerClient } from "@/lib/supabase/server";
import type { AnnouncementRow } from "@/types/database";
import type { AnnouncementItem } from "@/types/announcement";

export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("date", { ascending: false });

  if (error) {
    console.error("getAnnouncements error:", error.message);
    return [];
  }

  return (data as AnnouncementRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    isPinned: row.is_pinned,
    content: row.content,
  }));
}
