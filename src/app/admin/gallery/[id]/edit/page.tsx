import { notFound } from "next/navigation";
import { GalleryForm } from "@/components/directory/GalleryForm";
import { getGalleryById } from "@/services/gallery.service";

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getGalleryById(id);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <h1 className="h4 mb-4">Edit Foto Galeri</h1>
      <GalleryForm initialData={item} />
    </div>
  );
}
