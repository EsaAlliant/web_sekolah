import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { LegalContent } from "@/components/common/LegalContent";
import { getWebsiteSettings } from "@/services/settings.service";
import { getLegalSections } from "@/services/legal.service";

export default async function PrivacyPage() {
  const [settings, sections] = await Promise.all([getWebsiteSettings(), getLegalSections("privacy")]);

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Kebijakan Privasi" }]} eyebrow="Legal" title="Kebijakan Privasi" />
      <Section>
        <div className="legal-content">
          <p className="text-muted-strong">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          <LegalContent sections={sections} settings={settings} />
        </div>
      </Section>
    </>
  );
}
