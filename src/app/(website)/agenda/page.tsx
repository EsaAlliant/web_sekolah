import { AgendaList } from "@/components/directory/AgendaList";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getAgenda } from "@/services/agenda.service";

export default async function AgendaPage() {
  const events = await getAgenda();
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Agenda" }]} description="Kalender kegiatan akademik dan kesiswaan sekolah sepanjang tahun ajaran." eyebrow="Agenda" title="Agenda Sekolah" />

      <Section>
        <AgendaList events={events} todayIso={todayIso} />
      </Section>
    </>
  );
}
