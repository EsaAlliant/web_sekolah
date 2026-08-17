import { notFound } from "next/navigation";
import { FacilityForm } from "@/components/directory/FacilityForm";
import { getFacilities } from "@/services/facility.service";

export default async function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const facilities = await getFacilities();
  const item = facilities.find((entry) => entry.id === id);
  if (!item) notFound();
  return <div><h1 className="h4 mb-4">Edit Fasilitas</h1><FacilityForm initialData={item} /></div>;
}
