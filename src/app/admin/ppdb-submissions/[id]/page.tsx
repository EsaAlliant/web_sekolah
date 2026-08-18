import Link from "next/link";
import { notFound } from "next/navigation";
import { PpdbStatusSelect } from "@/components/directory/PpdbStatusSelect";
import { createServerClient } from "@/lib/supabase/server";
import { getMajorById } from "@/services/academic.service";
import type { PpdbSubmissionRow } from "@/types/database";

function DataRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="col-md-6">
      <span className="d-block text-muted-strong small">{label}</span>
      <span className="fw-semibold">{value || "-"}</span>
    </div>
  );
}

export default async function AdminPpdbSubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data } = await supabase.from("ppdb_submissions").select("*").eq("id", id).single();
  if (!data) notFound();

  const submission = data as PpdbSubmissionRow;
  const major = submission.major_id ? await getMajorById(submission.major_id) : undefined;
  const hasGuardian = Boolean(submission.guardian_name);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <Link className="text-muted-strong small mb-2 d-inline-block" href="/admin/ppdb-submissions"><i aria-hidden="true" className="bi bi-arrow-left" /> Kembali ke daftar pendaftar</Link>
          <h1 className="h4 mb-0">{submission.full_name}</h1>
          <p className="text-muted-strong mb-0">Daftar pada {new Date(submission.created_at).toLocaleString("id-ID")}</p>
        </div>
        <PpdbStatusSelect id={submission.id} status={submission.status} />
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h2 className="h6 ppdb-session-title">Sesi 1: Data Diri Peserta Didik</h2>
          <div className="row g-3">
            <DataRow label="Jenis Pendaftaran" value={submission.registration_type} />
            <DataRow label="Nama Lengkap" value={submission.full_name} />
            <DataRow label="Jenis Kelamin" value={submission.gender} />
            <DataRow label="Nomor Kartu Keluarga" value={submission.kk_number} />
            <DataRow label="NIK" value={submission.nik} />
            <DataRow label="Nama Sekolah Asal SMP" value={submission.previous_school} />
            <DataRow label="Tempat Lahir" value={submission.birth_place} />
            <DataRow label="Tanggal Lahir" value={submission.birth_date ? new Date(submission.birth_date).toLocaleDateString("id-ID") : "-"} />
            <DataRow label="Agama" value={submission.religion} />
            <DataRow label="Alamat Tempat Tinggal" value={submission.address} />
            <DataRow label="RT/RW" value={submission.rt_rw} />
            <DataRow label="Dusun" value={submission.dusun} />
            <DataRow label="Kelurahan/Desa" value={submission.village} />
            <DataRow label="Kecamatan" value={submission.district} />
            <DataRow label="Kabupaten/Kota" value={submission.regency} />
            <DataRow label="Propinsi" value={submission.province} />
            <DataRow label="Kode Pos" value={submission.postal_code} />
            <DataRow label="Jenis Tinggal" value={submission.living_arrangement} />
            <DataRow label="Alat Transportasi ke Sekolah" value={submission.transportation} />
            <DataRow label="Anak Keberapa (berdasarkan KK)" value={submission.child_order} />
            <DataRow label="Nomor HP" value={submission.phone} />
            <DataRow label="Alamat Email" value={submission.email} />
            <DataRow label="Hobi" value={submission.hobby} />
            <DataRow label="Cita-Cita" value={submission.ambition} />
            <DataRow label="Pilihan Jurusan" value={major ? `${major.name} (${major.abbreviation})` : "-"} />
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h2 className="h6 ppdb-session-title">Sesi 2: Data Ayah Kandung</h2>
          <div className="row g-3">
            <DataRow label="Nama Ayah" value={submission.father_name} />
            <DataRow label="NIK Ayah" value={submission.father_nik} />
            <DataRow label="Tahun Lahir Ayah" value={submission.father_birth_year} />
            <DataRow label="Pendidikan Ayah" value={submission.father_education} />
            <DataRow label="Pekerjaan Ayah" value={submission.father_job} />
            <DataRow label="Penghasilan Ayah" value={submission.father_income} />
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h2 className="h6 ppdb-session-title">Sesi 3: Data Ibu Kandung</h2>
          <div className="row g-3">
            <DataRow label="Nama Ibu" value={submission.mother_name} />
            <DataRow label="NIK Ibu" value={submission.mother_nik} />
            <DataRow label="Tahun Lahir Ibu" value={submission.mother_birth_year} />
            <DataRow label="Pendidikan Ibu" value={submission.mother_education} />
            <DataRow label="Pekerjaan Ibu" value={submission.mother_job} />
            <DataRow label="Penghasilan Ibu" value={submission.mother_income} />
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h2 className="h6 ppdb-session-title">Sesi 4: Data Wali</h2>
          {hasGuardian ? (
            <div className="row g-3">
              <DataRow label="Nama Wali" value={submission.guardian_name} />
              <DataRow label="NIK Wali" value={submission.guardian_nik} />
              <DataRow label="Tahun Lahir Wali" value={submission.guardian_birth_year} />
              <DataRow label="Pendidikan Wali" value={submission.guardian_education} />
              <DataRow label="Pekerjaan Wali" value={submission.guardian_job} />
              <DataRow label="Penghasilan Wali" value={submission.guardian_income} />
            </div>
          ) : (
            <p className="text-muted-strong mb-0">Peserta didik tidak mengisi data wali (tinggal bersama orang tua kandung).</p>
          )}
        </div>
      </div>
    </div>
  );
}
