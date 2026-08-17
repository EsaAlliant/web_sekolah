"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/directory/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import type { Facility } from "@/types/facility";

const CATEGORY_SUGGESTIONS = ["Ruang Praktik", "Laboratorium", "Fasilitas Umum"];

export function FacilityForm({ initialData }: { initialData?: Facility }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? "bi-building");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { name, category, description, icon, photo_url: photoUrl ?? null };

    const { error: saveError } = isEdit
      ? await supabase.from("facilities").update(payload).eq("id", initialData!.id)
      : await supabase.from("facilities").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/facilities");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label" htmlFor="name">Nama Fasilitas</label>
          <input className="form-control" id="name" onChange={(event) => setName(event.target.value)} required type="text" value={name} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="category">Kategori</label>
          <input className="form-control" id="category" list="facility-category-suggestions" onChange={(event) => setCategory(event.target.value)} required type="text" value={category} />
          <datalist id="facility-category-suggestions">{CATEGORY_SUGGESTIONS.map((item) => <option key={item} value={item} />)}</datalist>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="description">Deskripsi</label>
          <textarea className="form-control" id="description" onChange={(event) => setDescription(event.target.value)} required rows={3} value={description} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="icon">Ikon (kalau belum ada foto)</label>
          <input className="form-control" id="icon" onChange={(event) => setIcon(event.target.value)} type="text" value={icon} />
        </div>
        <div className="col-12">
          <label className="form-label d-block">Foto (opsional)</label>
          <ImageUploader currentUrl={photoUrl} folder="facilities" label="Pilih Foto" onUploaded={setPhotoUrl} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Fasilitas"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/facilities")} type="button">Batal</button>
      </div>
    </form>
  );
}
