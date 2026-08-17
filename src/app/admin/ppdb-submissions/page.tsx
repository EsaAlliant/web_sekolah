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
      <p className="text-muted-strong mb-4">Data ini masuk otomatis dari form pendaftaran publik. Ubah status sesuai proses verifikasi.</p>

      {submissions.length === 0 ? (
        <p className="text-muted-strong">Belum ada pendaftar.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Nama</th><th>Asal Sekolah</th><th>No. HP Orang Tua</th><th>Jurusan</th><th>Tanggal Daftar</th><th style={{ width: "10rem" }}>Status</th></tr></thead>
            <tbody>
              {submissions.map((item) => (
                <tr key={item.id}>
                  <td>{item.full_name}</td>
                  <td>{item.previous_school}</td>
                  <td>{item.parent_phone}</td>
                  <td>{item.major_id}</td>
                  <td>{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                  <td><PpdbStatusSelect id={item.id} status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
