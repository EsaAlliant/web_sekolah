import { notFound } from "next/navigation";
import { FeatureForm } from "@/components/directory/FeatureForm";
import { getHomepageFeatures } from "@/services/homepage.service";

export default async function EditFeaturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const features = await getHomepageFeatures();
  const feature = features.find((item) => item.id === id);
  if (!feature) notFound();
  return <div><h1 className="h4 mb-4">Edit Fitur Unggulan</h1><FeatureForm initialData={feature} /></div>;
}
