import { DownloadList } from "@/components/directory/DownloadList";
import { LinksSubNav } from "@/components/common/LinksSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getDownloads } from "@/services/downloads.service";

export default async function DownloadsPage() {
  const downloads = await getDownloads();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Tautan", href: "/links" }, { label: "Download" }]} description="Formulir, kalender akademik, dan dokumen resmi sekolah." eyebrow="Tautan" title="Download" />
      <LinksSubNav />

      <Section>
        <DownloadList items={downloads} />
      </Section>
    </>
  );
}
