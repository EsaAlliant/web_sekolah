import { CurriculumForm } from "@/components/directory/CurriculumForm";
import { getCurriculum } from "@/services/academic.service";

export default async function AdminCurriculumPage() {
  const curriculum = await getCurriculum();
  return (
    <div>
      <h1 className="h4 mb-1">Kurikulum &amp; Utilitas</h1>
      <p className="text-muted-strong mb-4">Konten ini tampil di halaman /academic/curriculum.</p>
      <CurriculumForm initialData={curriculum} />
    </div>
  );
}
