import { notFound } from "next/navigation";
import { DownloadForm } from "@/components/directory/DownloadForm";
import { getDownloads } from "@/services/downloads.service";

export default async function EditDownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await getDownloads();
  const item = items.find((entry) => entry.id === id);
  if (!item) notFound();
  return <div><h1 className="h4 mb-4">Edit Dokumen</h1><DownloadForm initialData={item} /></div>;
}
