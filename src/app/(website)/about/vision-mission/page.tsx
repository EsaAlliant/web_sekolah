import { AboutSubNav } from "@/components/common/AboutSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getVisionMission } from "@/services/about.service";

export default async function VisionMissionPage() {
  const visionMission = await getVisionMission();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Profil Kami", href: "/about" }, { label: "Visi dan Misi" }]} eyebrow="Profil Kami" title="Visi dan Misi" />
      <AboutSubNav />

      <Section>
        <div className="vision-card mb-5">
          <span className="vision-label">Visi</span>
          <p className="vision-text mb-0">{visionMission.vision}</p>
        </div>

        <h2 className="h4 mb-4">Misi</h2>
        <div className="row g-4 mb-5">
          {visionMission.missions.map((mission, index) => (
            <div className="col-md-6" key={mission.slice(0, 24)}>
              <div className="mission-card">
                <span className="mission-number">{String(index + 1).padStart(2, "0")}</span>
                <p className="mb-0 text-muted-strong">{mission}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="h4 mb-4">Nilai Utama</h2>
        <div className="row g-3">
          {visionMission.values.map((value) => (
            <div className="col-6 col-md-3" key={value.label}>
              <div className="value-badge">
                <i aria-hidden="true" className={`bi ${value.icon}`} />
                <span>{value.label}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
