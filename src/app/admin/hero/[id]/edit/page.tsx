import { notFound } from "next/navigation";
import { HeroSlideForm } from "@/components/directory/HeroSlideForm";
import { getHeroSlideById } from "@/services/homepage.service";

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slide = await getHeroSlideById(id);
  if (!slide) notFound();
  return <div><h1 className="h4 mb-4">Edit Slide Hero</h1><HeroSlideForm initialData={slide} /></div>;
}
