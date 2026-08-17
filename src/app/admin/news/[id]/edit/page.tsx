import { notFound } from "next/navigation";
import { NewsForm } from "@/components/directory/NewsForm";
import { getNews } from "@/services/news.service";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allNews = await getNews();
  const item = allNews.find((entry) => entry.id === id);
  if (!item) notFound();
  return <div><h1 className="h4 mb-4">Edit Berita</h1><NewsForm initialData={item} /></div>;
}
