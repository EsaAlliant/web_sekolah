import { notFound } from "next/navigation";
import { AnnouncementForm } from "@/components/directory/AnnouncementForm";
import { getAnnouncements } from "@/services/announcement.service";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await getAnnouncements();
  const item = items.find((entry) => entry.id === id);
  if (!item) notFound();
  return <div><h1 className="h4 mb-4">Edit Pengumuman</h1><AnnouncementForm initialData={item} /></div>;
}
