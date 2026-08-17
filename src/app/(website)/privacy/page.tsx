import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { getWebsiteSettings } from "@/services/settings.service";

export default async function PrivacyPage() {
  const settings = await getWebsiteSettings();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Kebijakan Privasi" }]} eyebrow="Legal" title="Kebijakan Privasi" />
      <Section>
        <div className="legal-content">
          <p className="text-muted-strong">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>

          <h2 className="h5 mt-4">1. Data yang Kami Kumpulkan</h2>
          <p className="text-muted-strong">Kami mengumpulkan data berikut saat Anda menggunakan situs ini:</p>
          <ul className="text-muted-strong">
            <li>Data pendaftaran PPDB (nama, tanggal lahir, alamat, asal sekolah, data orang tua/wali) yang Anda isi secara sukarela melalui formulir pendaftaran.</li>
            <li>Pesan yang Anda kirim melalui formulir kontak.</li>
            <li>Statistik kunjungan halaman (jumlah kunjungan dan halaman yang diakses) untuk keperluan analitik internal, tanpa mengidentifikasi Anda secara pribadi.</li>
          </ul>

          <h2 className="h5 mt-4">2. Penggunaan Data</h2>
          <p className="text-muted-strong">Data yang Anda berikan digunakan semata-mata untuk keperluan proses penerimaan peserta didik baru, menjawab pertanyaan yang Anda ajukan, dan meningkatkan layanan situs ini. Kami tidak menjual atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan komersial.</p>

          <h2 className="h5 mt-4">3. Penyimpanan Data</h2>
          <p className="text-muted-strong">Data disimpan secara aman menggunakan layanan penyimpanan basis data pihak ketiga (Supabase) dengan kebijakan akses yang membatasi data pendaftar hanya dapat dilihat oleh pihak sekolah yang berwenang.</p>

          <h2 className="h5 mt-4">4. Hak Anda</h2>
          <p className="text-muted-strong">Anda berhak meminta akses, koreksi, atau penghapusan data pribadi yang telah Anda berikan dengan menghubungi kami melalui halaman Kontak.</p>

          <h2 className="h5 mt-4">5. Perubahan Kebijakan</h2>
          <p className="text-muted-strong">Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan akan diinformasikan melalui halaman ini.</p>

          <h2 className="h5 mt-4">6. Kontak</h2>
          <p className="text-muted-strong">Pertanyaan seputar kebijakan privasi ini dapat disampaikan melalui email {settings.email} atau halaman Kontak kami.</p>
        </div>
      </Section>
    </>
  );
}
