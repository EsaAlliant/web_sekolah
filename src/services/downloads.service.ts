import { createServerClient } from "@/lib/supabase/server";
import type { DownloadRow } from "@/types/database";
import type { DownloadItem } from "@/types/download";

function mapRow(row: DownloadRow): DownloadItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    fileType: row.file_type,
    fileSize: row.file_size ?? "-",
    updatedDate: row.updated_date ?? "",
    description: row.description ?? "",
    fileUrl: row.file_url ?? "#",
  };
}

export async function getDownloads(): Promise<DownloadItem[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("downloads").select("*").order("updated_date", { ascending: false });

  if (error) {
    console.error("getDownloads error:", error.message);
    return [];
  }

  return (data as DownloadRow[]).map(mapRow);
}
