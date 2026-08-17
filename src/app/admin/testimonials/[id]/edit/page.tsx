import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/directory/TestimonialForm";
import { getTestimonials } from "@/services/testimonial.service";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await getTestimonials();
  const item = items.find((entry) => entry.id === id);
  if (!item) notFound();
  return <div><h1 className="h4 mb-4">Edit Testimoni</h1><TestimonialForm initialData={item} /></div>;
}
