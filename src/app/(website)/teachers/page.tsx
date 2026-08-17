import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { UnitSubNav } from "@/components/common/UnitSubNav";
import { TeacherDirectory } from "@/components/directory/TeacherDirectory";
import { getTeachers } from "@/services/teacher.service";

export default async function TeachersPage() {
  const teachers = await getTeachers();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Unit Kerja", href: "/units" }, { label: "Guru" }]} description="Tenaga pendidik yang berdedikasi membimbing peserta didik meraih kompetensi terbaiknya." eyebrow="Unit Kerja" title="Guru" />
      <UnitSubNav />

      <Section>
        <TeacherDirectory teachers={teachers} />
      </Section>
    </>
  );
}
