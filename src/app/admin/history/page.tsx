import { HistoryForm } from "@/components/directory/HistoryForm";
import { getHistory } from "@/services/about.service";

export default async function AdminHistoryPage() {
  const history = await getHistory();
  return (
    <div>
      <h1 className="h4 mb-1">Sejarah</h1>
      <p className="text-muted-strong mb-4">Konten ini tampil di halaman /about/history.</p>
      <HistoryForm initialData={history} />
    </div>
  );
}
