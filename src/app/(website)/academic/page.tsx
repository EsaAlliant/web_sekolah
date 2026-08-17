import Link from "next/link";
import { AcademicSubNav } from "@/components/common/AcademicSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getCurriculum, getMajors } from "@/services/academic.service";

const links = [
  { href: "/academic/majors", title: "Jurusan", description: "Daftar program keahlian beserta kompetensi dan prospek karier lulusan.", icon: "bi-diagram-3" },
  { href: "/academic/curriculum", title: "Kurikulum", description: "Struktur kurikulum dan tahapan pembelajaran dari Kelas X hingga XII.", icon: "bi-journal-text" },
];

export default async function AcademicPage() {
  const [majors, curriculum] = await Promise.all([getMajors(), getCurriculum()]);

  const quickFacts = [
    { label: "Program Keahlian", value: `${majors.length} Jurusan`, icon: "bi-diagram-3" },
    { label: "Kurikulum", value: curriculum.framework, icon: "bi-journal-text" },
    { label: "Lama Pendidikan", value: "3 Tahun", icon: "bi-calendar3" },
    { label: "Praktik Kerja Lapangan", value: "Kelas XII", icon: "bi-briefcase" },
  ];

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Program Keahlian" }]} description="Program keahlian dan kurikulum yang menyiapkan peserta didik siap kerja, siap kuliah, dan siap berwirausaha." eyebrow="Program Keahlian" title="Program Keahlian Sekolah" />
      <AcademicSubNav />

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

        <div className="row g-4 mb-5">
          {links.map((link) => (
            <div className="col-md-6" key={link.href}>
              <Link className="about-link-card" href={link.href}>
                <i aria-hidden="true" className={`bi ${link.icon}`} />
                <h3 className="h6 mb-2">{link.title}</h3>
                <p className="text-muted-strong mb-3">{link.description}</p>
                <span className="about-link-cta">Lihat selengkapnya <i aria-hidden="true" className="bi bi-arrow-right" /></span>
              </Link>
            </div>
          ))}
        </div>

        <h2 className="h4 mb-4">Sekilas Jurusan</h2>
        <div className="row g-3">
          {majors.map((major) => (
            <div className="col-6 col-md-4 col-lg-2" key={major.id}>
              <div className="value-badge">
                <i aria-hidden="true" className={`bi ${major.icon}`} />
                <span>{major.abbreviation}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
