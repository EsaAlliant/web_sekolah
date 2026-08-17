import Link from "next/link";
import { Avatar } from "@/components/common/Avatar";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SignatureDivider } from "@/components/common/SignatureDivider";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import { getAgenda } from "@/services/agenda.service";
import { getGallery } from "@/services/gallery.service";
import { getHeroSlides, getHomepageFeatures } from "@/services/homepage.service";
import { getMajors } from "@/services/academic.service";
import { getNews } from "@/services/news.service";
import { getStaff } from "@/services/staff.service";
import { getTeachers } from "@/services/teacher.service";
import { getTestimonials } from "@/services/testimonial.service";
import { getWebsiteSettings } from "@/services/settings.service";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const formatDay = (dateString: string) => Number(dateString.slice(8, 10));
const formatMonth = (dateString: string) => monthNames[Number(dateString.slice(5, 7)) - 1];

export default async function HomePage() {
  const [settings, majors, teachers, staff, news, agenda, gallery, testimonials, heroSlides, whyUs] = await Promise.all([
    getWebsiteSettings(),
    getMajors(),
    getTeachers(),
    getStaff(),
    getNews(),
    getAgenda(),
    getGallery(),
    getTestimonials(),
    getHeroSlides(),
    getHomepageFeatures(),
  ]);

  const todayIso = new Date().toISOString().slice(0, 10);
  const upcomingAgenda = agenda.filter((event) => (event.endDate ?? event.startDate) >= todayIso).slice(0, 3);
  const latestNews = news.slice(0, 3);
  const galleryPreview = gallery.slice(0, 6);
  const testimonialPreview = testimonials.filter((item) => !item.videoUrl).slice(0, 3);

  const quickFacts = [
    { label: "Program Keahlian", value: `${majors.length} Jurusan`, icon: "bi-diagram-3" },
    { label: "Tenaga Pendidik", value: `${teachers.length + staff.length} Orang`, icon: "bi-people" },
    { label: "Akreditasi", value: settings.accreditation, icon: "bi-patch-check" },
    { label: "Berdiri Sejak", value: settings.foundedYear, icon: "bi-calendar-event" },
  ];

  return (
    <>
      <Hero slides={heroSlides} />
      <SignatureDivider />

      <Section>
        <div className="welcome-block">
          <span className="section-heading-eyebrow">Selamat Datang</span>
          <h1 className="h2 mb-3">Selamat Datang di {settings.name}</h1>
          <p className="text-muted-strong welcome-text">
            {settings.description} Kami membuka kesempatan bagi setiap peserta didik untuk tumbuh menjadi pribadi
            yang kompeten, berkarakter, dan siap menghadapi masa depan, didukung tenaga pendidik profesional serta
            lingkungan belajar yang aman dan inspiratif.
          </p>
          <div className="welcome-actions">
            <Link className="btn btn-primary btn-lg" href="/ppdb">Daftar PPDB Sekarang</Link>
            <Link className="btn btn-outline-primary btn-lg" href="/about">Kenali Sekolah Kami</Link>
          </div>
        </div>

        <div className="row g-4 mt-4">
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
      </Section>

      <Section className="section-alt">
        <SectionHeading eyebrow="Keunggulan" title="Kenapa Memilih Kami" />
        <div className="row g-4">
          {whyUs.map((item) => (
            <div className="col-sm-6 col-lg-3" key={item.id}>
              <div className="whyus-card">
                <div className="whyus-icon" aria-hidden="true"><i className={`bi ${item.icon}`} /></div>
                <h3 className="h6 mb-1">{item.title}</h3>
                <p className="text-muted-strong mb-0">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Program Keahlian" title="Jurusan yang Tersedia" viewAllHref="/academic/majors" />
        <div className="row g-4">
          {majors.map((major) => (
            <div className="col-md-6" key={major.id}>
              <Link className="major-preview-card" href="/academic/majors">
                <div className="major-icon" aria-hidden="true"><i className={`bi ${major.icon}`} /></div>
                <div>
                  <h3 className="h6 mb-1">{major.name}</h3>
                  <span className="major-badge">{major.abbreviation} &bull; {major.duration}</span>
                  <p className="text-muted-strong mb-0 mt-2">{major.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section className="section-alt">
        <SectionHeading eyebrow="Galeri" title="Momen di Sekolah Kami" viewAllHref="/gallery" />
        <div className="gallery-preview-strip">
          {galleryPreview.map((item) => (
            <Link className="gallery-preview-tile" href="/gallery" key={item.id}>
              {item.photoUrl ? (
                <img alt={item.title} className="gallery-tile-photo" src={item.photoUrl} />
              ) : (
                <span className="gallery-tile-visual" aria-hidden="true"><i className={`bi ${item.icon}`} /></span>
              )}
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Informasi" title="Berita Terbaru" viewAllHref="/news" />
        <div className="row g-4">
          {latestNews.map((item) => (
            <div className="col-md-4" key={item.id}>
              <Link className="news-card" href={`/news/${item.slug}`}>
                <span className="news-card-visual" aria-hidden="true">
                  {item.photoUrl ? <img alt={item.title} className="news-visual-photo" src={item.photoUrl} /> : <i className={`bi ${item.icon}`} />}
                </span>
                <span className="news-card-body">
                  <span className="staff-tag">{item.category}</span>
                  <h3 className="h6 mt-2 mb-1">{item.title}</h3>
                  <span className="news-meta">{formatDay(item.date)} {formatMonth(item.date)} {item.date.slice(0, 4)}</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section className="section-alt">
        <SectionHeading eyebrow="Testimoni" title="Kata Mereka Tentang Kami" viewAllHref="/testimonials" />
        <div className="row g-4">
          {testimonialPreview.map((item) => (
            <div className="col-md-4" key={item.id}>
              <article className="testimonial-card">
                <i aria-hidden="true" className="bi bi-quote testimonial-quote-icon" />
                <p className="testimonial-quote">{item.quote}</p>
                <div className="testimonial-author">
                  <Avatar className="testimonial-avatar" name={item.name} photoUrl={item.photoUrl} />
                  <div>
                    <strong>{item.name}</strong>
                    <p className="text-muted-strong mb-0 testimonial-detail">{item.detail}</p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Agenda" title="Kegiatan Mendatang" viewAllHref="/agenda" />
        {upcomingAgenda.length === 0 ? (
          <EmptyState description="Nantikan kegiatan sekolah berikutnya." title="Belum ada agenda mendatang" />
        ) : (
          <div className="agenda-list">
            {upcomingAgenda.map((event) => (
              <article className="agenda-card" key={event.id}>
                <div className="agenda-date">
                  <span className="agenda-day">{formatDay(event.startDate)}</span>
                  <span className="agenda-month">{formatMonth(event.startDate)}</span>
                </div>
                <div className="agenda-content">
                  <span className="staff-tag">{event.category}</span>
                  <h3 className="h6 mt-2 mb-1">{event.title}</h3>
                  <ul className="agenda-meta list-unstyled mb-0">
                    {event.time && <li><i aria-hidden="true" className="bi bi-clock" /> {event.time}</li>}
                    <li><i aria-hidden="true" className="bi bi-geo-alt" /> {event.location}</li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section className="section-alt">
        <div className="cta-ppdb">
          <div>
            <span className="section-heading-eyebrow cta-ppdb-eyebrow">Penerimaan Peserta Didik Baru</span>
            <h2 className="h3 mb-2">Bergabunglah Bersama Kami</h2>
            <p className="mb-0 cta-ppdb-text">Pendaftaran peserta didik baru tahun ajaran 2026/2027 sudah dibuka. Jangan lewatkan kesempatan untuk menjadi bagian dari keluarga besar {settings.shortName}.</p>
          </div>
          <Link className="btn btn-light btn-lg" href="/ppdb">Daftar Sekarang</Link>
        </div>
      </Section>
    </>
  );
}
