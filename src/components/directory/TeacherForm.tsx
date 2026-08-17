"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/directory/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import type { Teacher } from "@/types/teacher";

export function TeacherForm({ initialData }: { initialData?: Teacher }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name ?? "");
  const [nip, setNip] = useState(initialData?.nip ?? "");
  const [position, setPosition] = useState(initialData?.position ?? "");
  const [subjectGroup, setSubjectGroup] = useState(initialData?.subjectGroup ?? "");
  const [education, setEducation] = useState(initialData?.education ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { name, nip: nip || null, position, subject_group: subjectGroup, education, email: email || null, photo_url: photoUrl ?? null };

    const { error: saveError } = isEdit
      ? await supabase.from("teachers").update(payload).eq("id", initialData!.id)
      : await supabase.from("teachers").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/teachers");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label" htmlFor="name">Nama Lengkap</label>
          <input className="form-control" id="name" onChange={(event) => setName(event.target.value)} required type="text" value={name} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="nip">NIP (opsional)</label>
          <input className="form-control" id="nip" onChange={(event) => setNip(event.target.value)} type="text" value={nip} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="position">Jabatan</label>
          <input className="form-control" id="position" onChange={(event) => setPosition(event.target.value)} placeholder="Guru Mapel / Wali Kelas / dst" required type="text" value={position} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="subjectGroup">Mata Pelajaran / Bidang</label>
          <input className="form-control" id="subjectGroup" onChange={(event) => setSubjectGroup(event.target.value)} required type="text" value={subjectGroup} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="education">Pendidikan Terakhir</label>
          <input className="form-control" id="education" onChange={(event) => setEducation(event.target.value)} required type="text" value={education} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="email">Email (opsional)</label>
          <input className="form-control" id="email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </div>
        <div className="col-12">
          <label className="form-label d-block">Foto</label>
          <ImageUploader currentUrl={photoUrl} folder="teachers" label="Pilih Foto" onUploaded={setPhotoUrl} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Guru"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/teachers")} type="button">Batal</button>
      </div>
    </form>
  );
}
