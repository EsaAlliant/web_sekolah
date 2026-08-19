import { LegalPageForm } from "@/components/directory/LegalPageForm";
import { getLegalSections } from "@/services/legal.service";

export default async function AdminLegalPrivacyPage() {
  const sections = await getLegalSections("privacy");
  return (
    <div>
      <h1 className="h4 mb-1">Kebijakan Privasi</h1>
      <p className="text-muted-strong mb-4">Konten ini tampil di halaman /privacy (tautan &quot;Privasi&quot; di footer).</p>
      <LegalPageForm initialData={sections} page="privacy" />
    </div>
  );
}
