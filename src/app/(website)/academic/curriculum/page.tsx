import { AcademicSubNav } from "@/components/common/AcademicSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getCurriculum } from "@/services/academic.service";

export default async function CurriculumPage() {
  const curriculum = await getCurriculum();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Program Keahlian", href: "/academic" }, { label: "Kurikulum" }]} description={curriculum.intro} eyebrow="Program Keahlian" title={`Kurikulum: ${curriculum.framework}`} />
      <AcademicSubNav />

      <Section>
        <h2 className="h4 mb-4">Kurikulum dan Utilitas</h2>
        <div className="profile-card mb-5">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="profile-item">
                <i aria-hidden="true" className="bi bi-mortarboard" />
                <div>
                  <span className="profile-label">Kurikulum</span>
                  <strong className="profile-value">{curriculum.profile.curriculumName}</strong>
                </div>
              </div>
              <div className="profile-item">
                <i aria-hidden="true" className="bi bi-clock" />
                <div>
                  <span className="profile-label">Penyelenggaraan</span>
                  <strong className="profile-value">{curriculum.profile.schedule}</strong>
                </div>
              </div>
              <div className="profile-item">
                <i aria-hidden="true" className="bi bi-calendar3" />
                <div>
                  <span className="profile-label">Semester Data</span>
                  <strong className="profile-value">{curriculum.profile.dataSemester}</strong>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-item">
                <i aria-hidden="true" className="bi bi-wifi" />
                <div>
                  <span className="profile-label">Akses Internet</span>
                  <strong className="profile-value">{curriculum.profile.internetAccess}</strong>
                </div>
              </div>
              <div className="profile-item">
                <i aria-hidden="true" className="bi bi-lightning-charge" />
                <div>
                  <span className="profile-label">Sumber Listrik</span>
                  <strong className="profile-value">{curriculum.profile.electricitySource}</strong>
                </div>
              </div>
              <div className="profile-item">
                <i aria-hidden="true" className="bi bi-shield-check" />
                <div>
                  <span className="profile-label">Daya Listrik</span>
                  <strong className="profile-value">{curriculum.profile.electricityPower}</strong>
                </div>
              </div>
              <div className="profile-item">
                <i aria-hidden="true" className="bi bi-geo-alt" />
                <div>
                  <span className="profile-label">Luas Tanah</span>
                  <strong className="profile-value">{curriculum.profile.landArea}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="h4 mb-4">Komponen Pembelajaran</h2>
        <div className="row g-4 mb-5">
          {curriculum.components.map((component) => (
            <div className="col-md-4" key={component.title}>
              <div className="mission-card h-100">
                <div>
                  <div className="curriculum-icon" aria-hidden="true"><i className={`bi ${component.icon}`} /></div>
                  <span className="curriculum-portion">{component.portion}</span>
                  <h3 className="h6 mt-2 mb-1">{component.title}</h3>
                  <p className="text-muted-strong mb-0">{component.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="h4 mb-4">Tahapan Belajar</h2>
        <ol className="timeline list-unstyled">
          {curriculum.structure.map((grade) => (
            <li className="timeline-item" key={grade.grade}>
              <div className="timeline-marker" aria-hidden="true" />
              <div className="timeline-content">
                <span className="timeline-year">{grade.grade}</span>
                <h3 className="h6 mb-1">{grade.title}</h3>
                <p className="text-muted-strong mb-0">{grade.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
