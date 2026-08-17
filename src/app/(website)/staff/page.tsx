import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { UnitSubNav } from "@/components/common/UnitSubNav";
import { StaffDirectory } from "@/components/directory/StaffDirectory";
import { getStaff } from "@/services/staff.service";

export default async function StaffPage() {
  const staff = await getStaff();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Unit Kerja", href: "/units" }, { label: "Staff" }]} description="Tenaga kependidikan yang mendukung kelancaran operasional dan layanan sekolah sehari-hari." eyebrow="Unit Kerja" title="Staff" />
      <UnitSubNav />

      <Section>
        <StaffDirectory staff={staff} />
      </Section>
    </>
  );
}
