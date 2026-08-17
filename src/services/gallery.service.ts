import { createServerClient } from "@/lib/supabase/server";
import type { GalleryItemRow } from "@/types/database";
import type { GalleryItem } from "@/types/gallery";

function mapRow(row: GalleryItemRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    description: row.description ?? "",
    icon: row.icon ?? "bi-image",
    photoUrl: row.photo_url ?? undefined,
  };
}

export async function getGallery(): Promise<GalleryItem[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("gallery_items").select("*").order("date", { ascending: false });

  if (error) {
    console.error("getGallery error:", error.message);
    return [];
  }

  return (data as GalleryItemRow[]).map(mapRow);
}

export async function getGalleryById(id: string): Promise<GalleryItem | undefined> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("gallery_items").select("*").eq("id", id).single();

  if (error || !data) {
    return undefined;
  }

  return mapRow(data as GalleryItemRow);
}
