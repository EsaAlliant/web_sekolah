import { InfoSubNav } from "@/components/common/InfoSubNav";
import { NewsGrid } from "@/components/directory/NewsGrid";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getNews } from "@/services/news.service";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Informasi", href: "/news" }, { label: "Berita" }]} description="Kabar terbaru seputar kegiatan, prestasi, dan informasi penting dari sekolah." eyebrow="Informasi" title="Berita Sekolah" />
      <InfoSubNav />

      <Section>
        <NewsGrid items={news} />
      </Section>
    </>
  );
}
