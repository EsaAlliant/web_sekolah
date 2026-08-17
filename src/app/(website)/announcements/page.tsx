import { AnnouncementList } from "@/components/directory/AnnouncementList";
import { InfoSubNav } from "@/components/common/InfoSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getAnnouncements } from "@/services/announcement.service";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Informasi", href: "/news" }, { label: "Pengumuman" }]} description="Informasi resmi dan pengumuman penting dari pihak sekolah." eyebrow="Informasi" title="Pengumuman" />
      <InfoSubNav />

      <Section>
        <AnnouncementList items={announcements} />
      </Section>
    </>
  );
}
