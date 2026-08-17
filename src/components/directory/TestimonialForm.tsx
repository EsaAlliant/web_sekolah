"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/directory/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/types/testimonial";

export function TestimonialForm({ initialData }: { initialData?: Testimonial }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState<Testimonial["category"]>(initialData?.category ?? "Alumni");
  const [detail, setDetail] = useState(initialData?.detail ?? "");
  const [quote, setQuote] = useState(initialData?.quote ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl);
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { name, category, detail, quote, photo_url: photoUrl ?? null, video_url: videoUrl || null };

    const { error: saveError } = isEdit
      ? await supabase.from("testimonials").update(payload).eq("id", initialData!.id)
      : await supabase.from("testimonials").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/testimonials");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="name">Nama</label>
          <input className="form-control" id="name" onChange={(event) => setName(event.target.value)} required type="text" value={name} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="category">Kategori</label>
          <select className="form-select" id="category" onChange={(event) => setCategory(event.target.value as Testimonial["category"])} value={category}>
            <option value="Alumni">Alumni</option>
            <option value="Siswa">Siswa</option>
            <option value="Orang Tua">Orang Tua</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="detail">Detail (kelas/jurusan/tahun lulus)</label>
          <input className="form-control" id="detail" onChange={(event) => setDetail(event.target.value)} required type="text" value={detail} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="quote">Kutipan / Isi Testimoni</label>
          <textarea className="form-control" id="quote" onChange={(event) => setQuote(event.target.value)} required rows={3} value={quote} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="videoUrl">Link Video YouTube (opsional)</label>
          <input className="form-control" id="videoUrl" onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://youtube.com/watch?v=..." type="url" value={videoUrl} />
        </div>
        <div className="col-12">
          <label className="form-label d-block">Foto (opsional)</label>
          <ImageUploader currentUrl={photoUrl} folder="testimonials" label="Pilih Foto" onUploaded={setPhotoUrl} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Testimoni"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/testimonials")} type="button">Batal</button>
      </div>
    </form>
  );
}
