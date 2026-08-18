import Link from "next/link";
import { PpdbStatusSelect } from "@/components/directory/PpdbStatusSelect";
import { createServerClient } from "@/lib/supabase/server";
import type { PpdbSubmissionRow } from "@/types/database";

export default async function AdminPpdbSubmissionsPage() {
  const supabase = await createServerClient();
  const { data } = await supabase.from("ppdb_submissions").select("*").order("created_at", { ascending: false });
  const submissions = (data ?? []) as PpdbSubmissionRow[];

  return (
    <div>
      <h1 className="h4 mb-1">Pendaftar PPDB</h1>
      <p className="text-muted-strong mb-4">Data ini masuk otomatis dari form pendaftaran publik (4 sesi). Klik &quot;Detail&quot; untuk melihat semua data pendaftar.</p>

      {submissions.length === 0 ? (
        <p className="text-muted-strong">Belum ada pendaftar.</p>
      ) : (
        <>
          {/* Tabel biasa - tablet ke atas */}
          <div className="table-responsive d-none d-md-block">
            <table className="table align-middle">
              <thead><tr><th>Nama</th><th>Jenis</th><th>Asal Sekolah</th><th>Nomor HP</th><th>Tanggal Daftar</th><th style={{ width: "10rem" }}>Status</th><th style={{ width: "6rem" }}>Detail</th></tr></thead>
              <tbody>
                {submissions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.full_name}</td>
                    <td><span className={`badge ${item.registration_type === "Pindahan" ? "text-bg-warning" : "text-bg-info"}`}>{item.registration_type || "-"}</span></td>
                    <td>{item.previous_school}</td>
                    <td>{item.phone}</td>
                    <td>{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                    <td><PpdbStatusSelect id={item.id} status={item.status} /></td>
                    <td><Link className="btn btn-outline-primary btn-sm" href={`/admin/ppdb-submissions/${item.id}`}><i aria-hidden="true" className="bi bi-eye" /> Detail</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tampilan kartu - HP, biar nggak ada kolom yang kepotong */}
          <div className="ppdb-submission-cards d-md-none">
            {submissions.map((item) => (
              <div className="ppdb-submission-card" key={item.id}>
                <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                  <div style={{ minWidth: 0 }}>
                    <p className="fw-semibold mb-0 text-truncate">{item.full_name}</p>
                    <span className={`badge ${item.registration_type === "Pindahan" ? "text-bg-warning" : "text-bg-info"}`}>{item.registration_type || "-"}</span>
                  </div>
                  <PpdbStatusSelect id={item.id} status={item.status} />
                </div>
                <dl className="ppdb-submission-card-meta">
                  <div><dt>Asal Sekolah</dt><dd>{item.previous_school || "-"}</dd></div>
                  <div><dt>Nomor HP</dt><dd>{item.phone || "-"}</dd></div>
                  <div><dt>Tanggal Daftar</dt><dd>{new Date(item.created_at).toLocaleDateString("id-ID")}</dd></div>
                </dl>
                <Link className="btn btn-outline-primary btn-sm w-100 mt-2" href={`/admin/ppdb-submissions/${item.id}`}>
                  <i aria-hidden="true" className="bi bi-eye" /> Lihat Detail
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
