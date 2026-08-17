import { AboutSubNav } from "@/components/common/AboutSubNav";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getPrincipal } from "@/services/about.service";
import { getWebsiteSettings } from "@/services/settings.service";

export default async function PrincipalPage() {
  const [settings, principal] = await Promise.all([getWebsiteSettings(), getPrincipal()]);

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Profil Kami", href: "/about" }, { label: "Sambutan Kepala Sekolah" }]} eyebrow="Profil Kami" title="Sambutan Kepala Sekolah" />
      <AboutSubNav />

      <Section>
        <div className="row g-5 align-items-start">
          <div className="col-lg-4">
            <div className="principal-card">
              {principal.photoUrl ? (
                <img alt={principal.name} className="principal-photo principal-photo-img" src={principal.photoUrl} />
              ) : (
                <div className="principal-photo" role="img" aria-label="Foto Kepala Sekolah">
                  <i aria-hidden="true" className="bi bi-person-fill" />
                </div>
              )}
              <h2 className="h5 mb-1">{principal.name}</h2>
              <p className="text-muted-strong mb-3">{principal.positionPrefix} {settings.shortName}</p>
              <ul className="principal-meta list-unstyled mb-0">
                <li><i aria-hidden="true" className="bi bi-envelope" /> {principal.emailPrefix}@{settings.email.split("@")[1]}</li>
                <li><i aria-hidden="true" className="bi bi-telephone" /> {settings.phone}</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-8">
            <p className="lead-quote mb-4">&ldquo;{principal.quote}&rdquo;</p>

            {principal.messages.map((paragraph) => (
              <p className="text-muted-strong" key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}

            <div className="principal-signature">
              <p className="mb-0">{principal.closing}</p>
              <strong>{principal.name}</strong>
              <span className="text-muted-strong">{principal.positionPrefix} {settings.shortName}</span>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
