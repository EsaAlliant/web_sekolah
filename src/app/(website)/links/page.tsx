import Link from "next/link";
import { LinksSubNav } from "@/components/common/LinksSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getDownloads } from "@/services/downloads.service";
import { getFaq } from "@/services/faq.service";

const links = [
  { href: "/downloads", title: "Download", description: "Formulir, kalender akademik, dan dokumen resmi sekolah yang bisa diunduh.", icon: "bi-download" },
  { href: "/faq", title: "FAQ", description: "Jawaban atas pertanyaan yang paling sering diajukan seputar sekolah.", icon: "bi-question-circle" },
];

export default async function LinksPage() {
  const [downloads, faq] = await Promise.all([getDownloads(), getFaq()]);

  const quickFacts = [
    { label: "Dokumen Tersedia", value: `${downloads.length} File`, icon: "bi-file-earmark" },
    { label: "Kategori Dokumen", value: `${new Set(downloads.map((item) => item.category)).size} Kategori`, icon: "bi-tags" },
    { label: "Pertanyaan FAQ", value: `${faq.length} Pertanyaan`, icon: "bi-question-circle" },
    { label: "Kategori FAQ", value: `${new Set(faq.map((item) => item.category)).size} Kategori`, icon: "bi-collection" },
  ];

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Tautan" }]} description="Kumpulan dokumen unduhan dan jawaban pertanyaan yang sering ditanyakan seputar sekolah." eyebrow="Tautan" title="Tautan dan Informasi" />
      <LinksSubNav />

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
                <span className="about-link-cta">Lihat selengkapnya <i aria-hidden="true" className="bi bi-arrow-right" /></span>
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
