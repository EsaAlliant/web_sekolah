import { LegalPageForm } from "@/components/directory/LegalPageForm";
import { getLegalSections } from "@/services/legal.service";

export default async function AdminLegalTermsPage() {
  const sections = await getLegalSections("terms");
  return (
    <div>
      <h1 className="h4 mb-1">Ketentuan Penggunaan</h1>
      <p className="text-muted-strong mb-4">Konten ini tampil di halaman /terms (tautan &quot;Ketentuan&quot; di footer).</p>
      <LegalPageForm initialData={sections} page="terms" />
    </div>
  );
}
