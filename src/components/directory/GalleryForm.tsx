"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/directory/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import type { GalleryItem } from "@/types/gallery";

const CATEGORY_SUGGESTIONS = ["Kegiatan Belajar", "Ekstrakurikuler", "Acara Sekolah", "Prestasi", "Fasilitas Sekolah"];
const ICON_SUGGESTIONS = ["bi-image", "bi-book", "bi-trophy", "bi-people", "bi-camera", "bi-flag", "bi-music-note-beamed", "bi-hdd-network", "bi-heart-pulse"];

export function GalleryForm({ initialData }: { initialData?: GalleryItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? "bi-image");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { title, category, date, description, icon, photo_url: photoUrl ?? null };

    const { error: saveError } = isEdit
      ? await supabase.from("gallery_items").update(payload).eq("id", initialData!.id)
      : await supabase.from("gallery_items").insert(payload);

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    router.push("/admin/gallery");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label" htmlFor="title">Judul</label>
          <input className="form-control" id="title" onChange={(event) => setTitle(event.target.value)} required type="text" value={title} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="date">Tanggal</label>
          <input className="form-control" id="date" onChange={(event) => setDate(event.target.value)} required type="date" value={date} />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="category">Kategori</label>
          <input className="form-control" id="category" list="category-suggestions" onChange={(event) => setCategory(event.target.value)} required type="text" value={category} />
          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((item) => <option key={item} value={item} />)}
          </datalist>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="icon">Ikon (kalau belum ada foto)</label>
          <input className="form-control" id="icon" list="icon-suggestions" onChange={(event) => setIcon(event.target.value)} type="text" value={icon} />
          <datalist id="icon-suggestions">
            {ICON_SUGGESTIONS.map((item) => <option key={item} value={item} />)}
          </datalist>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="description">Deskripsi</label>
          <textarea className="form-control" id="description" onChange={(event) => setDescription(event.target.value)} required rows={3} value={description} />
        </div>

        <div className="col-12">
          <label className="form-label d-block">Foto (opsional, kalau kosong pakai ikon)</label>
          <ImageUploader currentUrl={photoUrl} folder="gallery" label="Pilih Foto" onUploaded={setPhotoUrl} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Foto"}
        </button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/gallery")} type="button">
          Batal
        </button>
      </div>
    </form>
  );
}
