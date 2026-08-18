"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/directory/ImageUploader";
import type { HeroSlideRow } from "@/types/database";

export function HeroSlideForm({ initialData }: { initialData?: HeroSlideRow }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData?.image_url ?? undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    if (!imageUrl) {
      setError("Gambar wajib diunggah.");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    const payload = { sort_order: sortOrder, image_url: imageUrl };

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
          <label className="form-label">Gambar Slide</label>
          <ImageUploader currentUrl={imageUrl} folder="hero" label="Pilih Gambar" maxDimension={1920} onUploaded={setImageUrl} />
          <p className="form-text">Gunakan gambar rasio 2:1 (mis. 1600×800px) agar tampil pas di semua ukuran layar, termasuk mobile.</p>
        </div>

        <div className="col-md-3">
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
