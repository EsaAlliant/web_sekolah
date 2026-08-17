import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getMajors } from "@/services/academic.service";

export default async function MajorsPage() {
  const majors = await getMajors();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Program Keahlian" }]} description="Program keahlian yang dirancang sesuai kebutuhan dunia usaha dan dunia industri saat ini." eyebrow="Program Keahlian" title="Jurusan" />

      <Section>
        <div className="row g-4">
          {majors.map((major) => (
            <div className="col-lg-6" key={major.id}>
              <article className="major-card">
                <div className="major-card-header">
                  <div className="major-icon" aria-hidden="true"><i className={`bi ${major.icon}`} /></div>
                  <div>
                    <h2 className="h6 mb-1">{major.name}</h2>
                    <span className="major-badge">{major.abbreviation} &bull; {major.duration}</span>
                  </div>
                </div>
                <p className="text-muted-strong">{major.description}</p>

                <h3 className="major-subheading">Kompetensi</h3>
                <ul className="major-list">
                  {major.competencies.map((competency) => (
                    <li key={competency}><i aria-hidden="true" className="bi bi-check2" />{competency}</li>
                  ))}
                </ul>

                <h3 className="major-subheading">Prospek Karier</h3>
                <div className="major-tags">
                  {major.careerPaths.map((career) => (
                    <span className="staff-tag" key={career}>{career}</span>
                  ))}
                </div>
              </article>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
