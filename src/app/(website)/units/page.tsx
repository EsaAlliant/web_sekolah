import Link from "next/link";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { UnitSubNav } from "@/components/common/UnitSubNav";
import { getStaff } from "@/services/staff.service";
import { getTeachers } from "@/services/teacher.service";

const links = [
  { href: "/teachers", title: "Guru", description: "Daftar tenaga pendidik beserta mata pelajaran dan jabatan yang diampu.", icon: "bi-person-video3" },
  { href: "/staff", title: "Staff", description: "Daftar tenaga kependidikan yang mendukung operasional sekolah.", icon: "bi-people" },
];

export default async function UnitsPage() {
  const [teachers, staff] = await Promise.all([getTeachers(), getStaff()]);
  const subjectGroups = new Set(teachers.map((teacher) => teacher.subjectGroup)).size;
  const units = new Set(staff.map((member) => member.unit)).size;

  const quickFacts = [
    { label: "Guru", value: `${teachers.length} Orang`, icon: "bi-person-video3" },
    { label: "Staff", value: `${staff.length} Orang`, icon: "bi-people" },
    { label: "Mata Pelajaran", value: `${subjectGroups} Bidang`, icon: "bi-journal-bookmark" },
    { label: "Unit Kerja", value: `${units} Unit`, icon: "bi-diagram-3" },
  ];

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Unit Kerja" }]} description="Kenali tenaga pendidik dan tenaga kependidikan yang menjalankan operasional sekolah." eyebrow="Unit Kerja" title="Guru dan Staff Sekolah" />
      <UnitSubNav />

      <Section>
        <div className="row g-4 mb-5">
          {quickFacts.map((fact) => (
            <div className="col-6 col-lg-3" key={fact.label}>
              <div className="quick-fact-card">
                <i aria-hidden="true" className={`bi ${fact.icon}`} />
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {links.map((link) => (
            <div className="col-md-6" key={link.href}>
              <Link className="about-link-card" href={link.href}>
                <i aria-hidden="true" className={`bi ${link.icon}`} />
                <h3 className="h6 mb-2">{link.title}</h3>
                <p className="text-muted-strong mb-3">{link.description}</p>
                <span className="about-link-cta">Lihat daftar <i aria-hidden="true" className="bi bi-arrow-right" /></span>
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
