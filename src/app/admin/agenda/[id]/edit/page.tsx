import { notFound } from "next/navigation";
import { AgendaForm } from "@/components/directory/AgendaForm";
import { getAgendaById } from "@/services/agenda.service";

export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getAgendaById(id);
  if (!event) notFound();
  return <div><h1 className="h4 mb-4">Edit Agenda</h1><AgendaForm initialData={event} /></div>;
}
