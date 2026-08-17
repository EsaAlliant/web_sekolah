"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/directory/ImageUploader";
import type { HeroSlideRow } from "@/types/database";

export function HeroSlideForm({ initialData }: { initialData?: HeroSlideRow }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [eyebrow, setEyebrow] = useState(initialData?.eyebrow ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [actionLabel, setActionLabel] = useState(initialData?.action_label ?? "");
  const [actionHref, setActionHref] = useState(initialData?.action_href ?? "");
  const [theme, setTheme] = useState(initialData?.theme ?? "primary");
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData?.image_url ?? undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { eyebrow, title, description, action_label: actionLabel, action_href: actionHref, theme, sort_order: sortOrder, image_url: imageUrl ?? null };

    const { error: saveError } = isEdit
      ? await supabase.from("hero_slides").update(payload).eq("id", initialData!.id)
      : await supabase.from("hero_slides").insert(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }

    router.push(isEdit ? "/admin/hero?saved=edit" : "/admin/hero?saved=new");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Gambar Latar Slide</label>
          <ImageUploader currentUrl={imageUrl} folder="hero" label="Pilih Gambar" maxDimension={1920} onUploaded={setImageUrl} />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="eyebrow">Label Kecil (Eyebrow)</label>
          <input className="form-control" id="eyebrow" onChange={(event) => setEyebrow(event.target.value)} required type="text" value={eyebrow} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="theme">Warna Tema</label>
          <select className="form-select" id="theme" onChange={(event) => setTheme(event.target.value as typeof theme)} value={theme}>
            <option value="primary">Biru (Primary)</option>
            <option value="gold">Kuning (Gold)</option>
            <option value="green">Hijau (Green)</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="title">Judul Besar</label>
          <input className="form-control" id="title" onChange={(event) => setTitle(event.target.value)} required type="text" value={title} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="description">Deskripsi</label>
          <textarea className="form-control" id="description" onChange={(event) => setDescription(event.target.value)} required rows={2} value={description} />
        </div>

        <div className="col-md-5">
          <label className="form-label" htmlFor="actionLabel">Teks Tombol</label>
          <input className="form-control" id="actionLabel" onChange={(event) => setActionLabel(event.target.value)} required type="text" value={actionLabel} />
        </div>
        <div className="col-md-5">
          <label className="form-label" htmlFor="actionHref">Link Tombol</label>
          <input className="form-control" id="actionHref" onChange={(event) => setActionHref(event.target.value)} placeholder="/about" required type="text" value={actionHref} />
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="sortOrder">Urutan</label>
          <input className="form-control" id="sortOrder" onChange={(event) => setSortOrder(Number(event.target.value))} type="number" value={sortOrder} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Slide"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/hero")} type="button">Batal</button>
      </div>
    </form>
  );
}
