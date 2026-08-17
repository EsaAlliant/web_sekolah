import { FaqAccordion } from "@/components/directory/FaqAccordion";
import { LinksSubNav } from "@/components/common/LinksSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getFaq } from "@/services/faq.service";

export default async function FaqPage() {
  const faq = await getFaq();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Tautan", href: "/links" }, { label: "FAQ" }]} description="Jawaban atas pertanyaan yang paling sering diajukan seputar sekolah." eyebrow="Tautan" title="Pertanyaan yang Sering Diajukan" />
      <LinksSubNav />

      <Section>
        <FaqAccordion items={faq} />
      </Section>
    </>
  );
}
