import { GalleryGrid } from "@/components/directory/GalleryGrid";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getGallery } from "@/services/gallery.service";

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Galeri" }]} description="Dokumentasi kegiatan belajar, ekstrakurikuler, acara, dan fasilitas sekolah." eyebrow="Galeri" title="Galeri Sekolah" />

      <Section>
        <GalleryGrid items={items} />
      </Section>
    </>
  );
}
