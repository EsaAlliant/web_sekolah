import { PpdbInfoForm } from "@/components/directory/PpdbInfoForm";
import { getPpdbInfo } from "@/services/ppdb.service";

export default async function AdminPpdbInfoPage() {
  const ppdbInfo = await getPpdbInfo();
  return (
    <div>
      <h1 className="h4 mb-1">Info PPDB</h1>
      <p className="text-muted-strong mb-4">Konten ini tampil di bagian informasi halaman /ppdb (bukan data pendaftar).</p>
      <PpdbInfoForm initialData={ppdbInfo} />
    </div>
  );
}
