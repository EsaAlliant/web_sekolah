import { PrincipalForm } from "@/components/directory/PrincipalForm";
import { getPrincipal } from "@/services/about.service";

export default async function AdminPrincipalPage() {
  const principal = await getPrincipal();
  return (
    <div>
      <h1 className="h4 mb-1">Sambutan Kepala Sekolah</h1>
      <p className="text-muted-strong mb-4">Konten ini tampil di halaman /about/principal.</p>
      <PrincipalForm initialData={principal} />
    </div>
  );
}
