import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getFacilities } from "@/services/facility.service";

export default async function FacilitiesPage() {
  const facilities = await getFacilities();
  const categories = Array.from(new Set(facilities.map((item) => item.category)));

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Fasilitas Sekolah" }]} description="Sarana dan prasarana yang mendukung kegiatan belajar dan aktivitas sehari-hari di sekolah." eyebrow="Profil Sekolah" title="Fasilitas Sekolah" />

      <Section>
        <div className="d-grid gap-5">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="h5 mb-3">{category}</h2>
              <div className="row g-4">
                {facilities.filter((item) => item.category === category).map((item) => (
                  <div className="col-md-6 col-lg-4" key={item.id}>
                    <article className="major-card h-100">
                      <div className="major-card-header">
                        <div className="major-icon" aria-hidden="true"><i className={`bi ${item.icon}`} /></div>
                        <h3 className="h6 mb-0">{item.name}</h3>
                      </div>
                      {item.photoUrl ? (
                        <img alt={item.name} className="gallery-tile-photo facility-photo" src={item.photoUrl} />
                      ) : null}
                      <p className="text-muted-strong mb-0">{item.description}</p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
