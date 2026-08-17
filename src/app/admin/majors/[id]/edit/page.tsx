import { notFound } from "next/navigation";
import { MajorForm } from "@/components/directory/MajorForm";
import { getMajorById } from "@/services/academic.service";

export default async function EditMajorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const major = await getMajorById(id);
  if (!major) notFound();
  return <div><h1 className="h4 mb-4">Edit Jurusan</h1><MajorForm initialData={major} /></div>;
}
