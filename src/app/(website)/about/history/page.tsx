import { AboutSubNav } from "@/components/common/AboutSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getHistory } from "@/services/about.service";
import { getWebsiteSettings } from "@/services/settings.service";

export default async function HistoryPage() {
  const [settings, history] = await Promise.all([getWebsiteSettings(), getHistory()]);

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Profil Kami", href: "/about" }, { label: "Sejarah" }]} eyebrow="Profil Kami" title="Sejarah Sekolah" />
      <AboutSubNav />

      <Section>
        <div className="row">
          <div className="col-lg-8 mb-5">
            <p className="text-muted-strong">{settings.name} {history.intro}</p>
          </div>
        </div>

        <ol className="timeline list-unstyled">
          {history.milestones.map((milestone) => (
            <li className="timeline-item" key={milestone.year}>
              <div className="timeline-marker" aria-hidden="true" />
              <div className="timeline-content">
                <span className="timeline-year">{milestone.year}</span>
                <h3 className="h6 mb-1">{milestone.title}</h3>
                <p className="text-muted-strong mb-0">{milestone.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
