import { notFound } from "next/navigation";
import { FaqForm } from "@/components/directory/FaqForm";
import { getFaq } from "@/services/faq.service";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await getFaq();
  const item = items.find((entry) => entry.id === id);
  if (!item) notFound();
  return <div><h1 className="h4 mb-4">Edit FAQ</h1><FaqForm initialData={item} /></div>;
}
