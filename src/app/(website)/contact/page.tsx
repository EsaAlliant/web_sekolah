import { ContactForm } from "@/components/directory/ContactForm";
import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getWebsiteSettings } from "@/services/settings.service";

export default async function ContactPage() {
  const settings = await getWebsiteSettings();

  const infoItems = [
    { icon: "bi-geo-alt", label: "Alamat", value: settings.address },
    { icon: "bi-telephone", label: "Telepon", value: settings.phone },
    { icon: "bi-envelope", label: "Email", value: settings.email },
    { icon: "bi-clock", label: "Jam Layanan", value: settings.officeHours },
  ];

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Kontak Kami" }]} description="Hubungi kami untuk informasi lebih lanjut seputar sekolah." eyebrow="Profil Sekolah" title="Kontak Kami" />

      <Section>
        <div className="row g-4 mb-5">
          <div className="col-lg-5">
            <div className="identity-card mb-4">
              <h2 className="h6 mb-3">Informasi Kontak</h2>
              <dl className="mb-0">
                {infoItems.map((item) => (
                  <div className="identity-row" key={item.label}>
                    <dt><i aria-hidden="true" className={`bi ${item.icon} me-1`} /> {item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <a className="btn btn-outline-primary" href={settings.whatsappUrl} rel="noreferrer" target="_blank">
              <i aria-hidden="true" className="bi bi-whatsapp" /> Chat via WhatsApp
            </a>
          </div>
          <div className="col-lg-7">
            <div className="contact-map-frame">
              <iframe
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
                title="Lokasi sekolah"
              />
            </div>
          </div>
        </div>

        <h2 className="h4 mb-2">Kirim Pesan</h2>
        <p className="text-muted-strong mb-4">Isi form di bawah ini, pesan akan langsung terkirim ke WhatsApp sekolah.</p>
        <ContactForm whatsappUrl={settings.whatsappUrl} />
      </Section>
    </>
  );
}
