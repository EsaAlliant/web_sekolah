"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/directory/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import type { Staff } from "@/types/staff";

const UNIT_SUGGESTIONS = ["Tata Usaha", "Perpustakaan", "Laboratorium", "IT Support", "Keamanan dan Kebersihan"];

export function StaffForm({ initialData }: { initialData?: Staff }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name ?? "");
  const [position, setPosition] = useState(initialData?.position ?? "");
  const [unit, setUnit] = useState(initialData?.unit ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { name, position, unit, email: email || null, photo_url: photoUrl ?? null };

    const { error: saveError } = isEdit
      ? await supabase.from("staff").update(payload).eq("id", initialData!.id)
      : await supabase.from("staff").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/staff");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="name">Nama Lengkap</label>
          <input className="form-control" id="name" onChange={(event) => setName(event.target.value)} required type="text" value={name} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="position">Jabatan</label>
          <input className="form-control" id="position" onChange={(event) => setPosition(event.target.value)} required type="text" value={position} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="unit">Unit Kerja</label>
          <input className="form-control" id="unit" list="unit-suggestions" onChange={(event) => setUnit(event.target.value)} required type="text" value={unit} />
          <datalist id="unit-suggestions">{UNIT_SUGGESTIONS.map((item) => <option key={item} value={item} />)}</datalist>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="email">Email (opsional)</label>
          <input className="form-control" id="email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </div>
        <div className="col-12">
          <label className="form-label d-block">Foto</label>
          <ImageUploader currentUrl={photoUrl} folder="staff" label="Pilih Foto" onUploaded={setPhotoUrl} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Staff"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/staff")} type="button">Batal</button>
      </div>
    </form>
  );
}
