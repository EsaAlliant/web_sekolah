import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getNews, getNewsBySlug } from "@/services/news.service";

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const allNews = await getNews();
  const related = allNews.filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Informasi", href: "/news" }, { label: "Berita", href: "/news" }, { label: article.title }]} eyebrow={article.category} title={article.title} />

      <Section>
        <div className="row">
          <div className="col-lg-8">
            <p className="news-meta mb-4">Oleh {article.author} &bull; {formatDate(article.date)}</p>
            {article.photoUrl ? (
              <img alt={article.title} className="news-featured-visual news-detail-visual news-visual-photo" src={article.photoUrl} />
            ) : (
              <span className="news-featured-visual news-detail-visual" aria-hidden="true"><i className={`bi ${article.icon}`} /></span>
            )}
            {article.content.map((paragraph) => (
              <p className="text-muted-strong" key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}

            <Link className="about-link-cta d-inline-flex mt-3" href="/news">
              <i aria-hidden="true" className="bi bi-arrow-left" /> Kembali ke Berita
            </Link>
          </div>

          {related.length > 0 && (
            <div className="col-lg-4">
              <h2 className="h6 mb-3">Berita Terkait</h2>
              <div className="d-grid gap-3">
                {related.map((item) => (
                  <Link className="news-related-card" href={`/news/${item.slug}`} key={item.id}>
                    <span className="staff-tag">{item.category}</span>
                    <h3 className="h6 mt-2 mb-0">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
