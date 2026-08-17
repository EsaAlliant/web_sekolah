import Link from "next/link";
import { AboutSubNav } from "@/components/common/AboutSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getMajors } from "@/services/academic.service";
import { getStaff } from "@/services/staff.service";
import { getTeachers } from "@/services/teacher.service";
import { getWebsiteSettings } from "@/services/settings.service";

const links = [
  { href: "/about/principal", title: "Sambutan Kepala Sekolah", description: "Pesan dan harapan Kepala Sekolah untuk seluruh warga sekolah.", icon: "bi-person-badge" },
  { href: "/about/history", title: "Sejarah", description: "Perjalanan sekolah dari awal berdiri hingga saat ini.", icon: "bi-hourglass-split" },
  { href: "/about/vision-mission", title: "Visi dan Misi", description: "Arah dan tujuan pendidikan yang ingin dicapai sekolah.", icon: "bi-flag" },
];

export default async function AboutPage() {
  const [settings, majors, teachers, staff] = await Promise.all([getWebsiteSettings(), getMajors(), getTeachers(), getStaff()]);

  const quickFacts = [
    { label: "Berdiri sejak", value: settings.foundedYear, icon: "bi-calendar-event" },
    { label: "Akreditasi", value: settings.accreditation, icon: "bi-patch-check" },
    { label: "Program Keahlian", value: `${majors.length} Jurusan`, icon: "bi-diagram-3" },
    { label: "Tenaga Pendidik", value: `${teachers.length + staff.length} Guru & Staf`, icon: "bi-people" },
  ];

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Profil Kami" }]} description={settings.description} eyebrow="Profil Kami" title={settings.name} />
      <AboutSubNav />

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

        <div className="row g-4 align-items-start mb-5">
          <div className="col-lg-7">
            <h2 className="h3 mb-3">Tentang {settings.shortName}</h2>
            <p className="text-muted-strong">
              {settings.name} adalah sekolah menengah kejuruan yang berkomitmen mencetak lulusan yang berkarakter,
              kompeten, dan siap bersaing di dunia kerja maupun pendidikan lanjutan. Kami memadukan kurikulum
              berbasis kompetensi dengan penguatan karakter, sehingga setiap peserta didik tumbuh menjadi pribadi
              yang mandiri, disiplin, dan berdaya saing.
            </p>
            <p className="text-muted-strong mb-0">
              Didukung oleh tenaga pendidik profesional, fasilitas praktik yang memadai, serta kerja sama dengan
              dunia usaha dan dunia industri, {settings.shortName} terus berupaya menghadirkan lingkungan belajar
              yang aman, inklusif, dan inspiratif bagi seluruh warga sekolah.
            </p>
          </div>
          <div className="col-lg-5">
            <div className="identity-card">
              <h3 className="h6 mb-3">Identitas Sekolah</h3>
              <dl className="mb-0">
                <div className="identity-row"><dt>Nama Sekolah</dt><dd>{settings.name}</dd></div>
                <div className="identity-row"><dt>Motto</dt><dd>{settings.motto}</dd></div>
                <div className="identity-row"><dt>Alamat</dt><dd>{settings.address}</dd></div>
                <div className="identity-row"><dt>Telepon</dt><dd>{settings.phone}</dd></div>
                <div className="identity-row"><dt>Email</dt><dd>{settings.email}</dd></div>
                <div className="identity-row"><dt>Jam Layanan</dt><dd>{settings.officeHours}</dd></div>
              </dl>
            </div>
          </div>
        </div>

        <h2 className="h4 mb-4">Selengkapnya</h2>
        <div className="row g-4">
          {links.map((link) => (
            <div className="col-md-4" key={link.href}>
              <Link className="about-link-card" href={link.href}>
                <i aria-hidden="true" className={`bi ${link.icon}`} />
                <h3 className="h6 mb-2">{link.title}</h3>
                <p className="text-muted-strong mb-3">{link.description}</p>
                <span className="about-link-cta">Selengkapnya <i aria-hidden="true" className="bi bi-arrow-right" /></span>
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
