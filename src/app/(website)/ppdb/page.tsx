import { PageBanner } from "@/components/common/PageBanner";
import { PpdbRegistrationGate } from "@/components/directory/PpdbRegistrationGate";
import { Section } from "@/components/common/Section";
import { SignatureDivider } from "@/components/common/SignatureDivider";
import { getMajors } from "@/services/academic.service";
import { getPpdbInfo } from "@/services/ppdb.service";
import { getWebsiteSettings } from "@/services/settings.service";

const statusLabel: Record<string, string> = { open: "Pendaftaran Dibuka", closed: "Pendaftaran Ditutup", draft: "Belum Dibuka" };
const statusClass: Record<string, string> = { open: "ppdb-status-open", closed: "ppdb-status-closed", draft: "ppdb-status-draft" };

export default async function PpdbPage() {
  const [ppdb, majors, settings] = await Promise.all([getPpdbInfo(), getMajors(), getWebsiteSettings()]);

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "PPDB" }]} description={`Penerimaan Peserta Didik Baru tahun ajaran ${ppdb.period}.`} eyebrow="PPDB" title="Penerimaan Peserta Didik Baru" />

      <Section>
        <div className="ppdb-status-bar">
          <span className={`ppdb-status-badge ${statusClass[ppdb.status]}`}>
            <i aria-hidden="true" className="bi bi-broadcast" /> {statusLabel[ppdb.status]}
          </span>
          <div className="ppdb-status-meta">
            <span><i aria-hidden="true" className="bi bi-people" /> Kuota: {ppdb.quota}</span>
            <span><i aria-hidden="true" className="bi bi-cash-coin" /> Biaya: {ppdb.fee}</span>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-lg-6">
            <h2 className="h5 mb-3">Berkas Persyaratan</h2>
            <ul className="major-list ppdb-requirements">
              {ppdb.requirements.map((item) => (
                <li key={item}><i aria-hidden="true" className="bi bi-check2-circle" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="col-lg-6">
            <h2 className="h5 mb-3">Jadwal Penting</h2>
            <ol className="timeline list-unstyled ppdb-timeline">
              {ppdb.timeline.map((item) => (
                <li className="timeline-item" key={item.label}>
                  <div className="timeline-marker" aria-hidden="true" />
                  <div className="timeline-content">
                    <h3 className="h6 mb-0">{item.label}</h3>
                    <span className="text-muted-strong">{item.date}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <h2 className="h5 mb-3 mt-4">Alur Pendaftaran</h2>
        <div className="ppdb-steps">
          {ppdb.steps.map((step, index) => (
            <div className="ppdb-step" key={step}>
              <span className="ppdb-step-number">{index + 1}</span>
              <p className="mb-0">{step}</p>
            </div>
          ))}
        </div>
      </Section>

      <SignatureDivider />

      <Section className="section-alt">
        <h2 className="h4 mb-2">Form Pendaftaran</h2>
        {ppdb.status === "open" && (
          <p className="text-muted-strong mb-4">
            Form terdiri dari 4 sesi: Data Diri, Data Ayah, Data Ibu, dan Data Wali. Isi setiap sesi lalu klik
            &quot;Selanjutnya&quot;. Setelah sesi terakhir, klik &quot;Kirim Pendaftaran&quot; — data akan otomatis
            tersusun rapi dan tercatat langsung untuk diproses panitia PPDB.
          </p>
        )}
        <PpdbRegistrationGate majors={majors} sheetWebhookUrl={settings.ppdbSheetWebhookUrl} status={ppdb.status} />
      </Section>
    </>
  );
}
