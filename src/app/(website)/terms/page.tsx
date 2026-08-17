import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getWebsiteSettings } from "@/services/settings.service";

export default async function TermsPage() {
  const settings = await getWebsiteSettings();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Ketentuan Penggunaan" }]} eyebrow="Legal" title="Ketentuan Penggunaan" />
      <Section>
        <div className="legal-content">
          <p className="text-muted-strong">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>

          <h2 className="h5 mt-4">1. Penerimaan Ketentuan</h2>
          <p className="text-muted-strong">Dengan mengakses dan menggunakan situs {settings.name}, Anda dianggap menyetujui ketentuan penggunaan yang berlaku ini.</p>

          <h2 className="h5 mt-4">2. Penggunaan Konten</h2>
          <p className="text-muted-strong">Seluruh konten pada situs ini (teks, foto, logo) adalah milik {settings.shortName} kecuali dinyatakan lain. Konten dapat digunakan untuk keperluan informasi pribadi dan non-komersial. Penggunaan ulang untuk tujuan komersial memerlukan izin tertulis dari pihak sekolah.</p>

          <h2 className="h5 mt-4">3. Formulir Pendaftaran dan Kontak</h2>
          <p className="text-muted-strong">Pengguna bertanggung jawab atas keakuratan data yang diisikan pada formulir pendaftaran PPDB maupun formulir kontak. Data yang tidak akurat dapat memengaruhi proses yang sedang berjalan.</p>

          <h2 className="h5 mt-4">4. Tautan Pihak Ketiga</h2>
          <p className="text-muted-strong">Situs ini dapat memuat tautan ke situs pihak ketiga (media sosial, video YouTube, dokumen unduhan). Kami tidak bertanggung jawab atas konten atau kebijakan privasi situs pihak ketiga tersebut.</p>

          <h2 className="h5 mt-4">5. Batasan Tanggung Jawab</h2>
          <p className="text-muted-strong">Kami berupaya menjaga informasi pada situs ini tetap akurat dan terkini, namun tidak menjamin bebas dari kesalahan. Informasi resmi dan mengikat tetap merujuk pada pengumuman tertulis dari pihak sekolah.</p>

          <h2 className="h5 mt-4">6. Perubahan Ketentuan</h2>
          <p className="text-muted-strong">Ketentuan ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan berlaku sejak dipublikasikan pada halaman ini.</p>

          <h2 className="h5 mt-4">7. Kontak</h2>
          <p className="text-muted-strong">Pertanyaan seputar ketentuan ini dapat disampaikan melalui email {settings.email} atau halaman Kontak kami.</p>
        </div>
      </Section>
    </>
  );
}
