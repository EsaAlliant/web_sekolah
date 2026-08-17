import { notFound } from "next/navigation";
import { TeacherForm } from "@/components/directory/TeacherForm";
import { getTeacherById } from "@/services/teacher.service";

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getTeacherById(id);
  if (!teacher) notFound();
  return <div><h1 className="h4 mb-4">Edit Guru</h1><TeacherForm initialData={teacher} /></div>;
}
