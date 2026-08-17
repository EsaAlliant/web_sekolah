import { notFound } from "next/navigation";
import { StaffForm } from "@/components/directory/StaffForm";
import { getStaffById } from "@/services/staff.service";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getStaffById(id);
  if (!member) notFound();
  return <div><h1 className="h4 mb-4">Edit Staff</h1><StaffForm initialData={member} /></div>;
}
