"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/directory/ImageUploader";
import { ListInput } from "@/components/directory/ListInput";
import { createClient } from "@/lib/supabase/client";
import type { NewsItem } from "@/types/news";

const CATEGORY_SUGGESTIONS = ["Prestasi", "PPDB", "Kegiatan", "Kemitraan"];
const ICON_SUGGESTIONS = ["bi-newspaper", "bi-trophy", "bi-mortarboard", "bi-people", "bi-megaphone", "bi-calendar-event"];

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function NewsForm({ initialData }: { initialData?: NewsItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [author, setAuthor] = useState(initialData?.author ?? "Humas Sekolah");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState<string[]>(initialData?.content ?? [""]);
  const [icon, setIcon] = useState(initialData?.icon ?? "bi-newspaper");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      title,
      slug: slug || slugify(title),
      category,
      author,
      date,
      excerpt,
      content: content.filter(Boolean),
      icon,
      photo_url: photoUrl ?? null,
    };

    const { error: saveError } = isEdit
      ? await supabase.from("news").update(payload).eq("id", initialData!.id)
      : await supabase.from("news").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/news");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="title">Judul</label>
          <input className="form-control" id="title" onChange={(event) => setTitle(event.target.value)} required type="text" value={title} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="slug">Slug URL (kosongkan biar otomatis)</label>
          <input className="form-control" id="slug" onChange={(event) => setSlug(event.target.value)} placeholder={slugify(title) || "judul-berita"} type="text" value={slug} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="category">Kategori</label>
          <input className="form-control" id="category" list="news-category-suggestions" onChange={(event) => setCategory(event.target.value)} required type="text" value={category} />
          <datalist id="news-category-suggestions">{CATEGORY_SUGGESTIONS.map((item) => <option key={item} value={item} />)}</datalist>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="author">Penulis</label>
          <input className="form-control" id="author" onChange={(event) => setAuthor(event.target.value)} required type="text" value={author} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="date">Tanggal</label>
          <input className="form-control" id="date" onChange={(event) => setDate(event.target.value)} required type="date" value={date} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="icon">Ikon (kalau belum ada gambar cover)</label>
          <input className="form-control" id="icon" list="news-icon-suggestions" onChange={(event) => setIcon(event.target.value)} type="text" value={icon} />
          <datalist id="news-icon-suggestions">
            {ICON_SUGGESTIONS.map((item) => <option key={item} value={item} />)}
          </datalist>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="excerpt">Ringkasan Singkat</label>
          <textarea className="form-control" id="excerpt" onChange={(event) => setExcerpt(event.target.value)} required rows={2} value={excerpt} />
        </div>
        <div className="col-12">
          <ListInput items={content} label="Isi Berita (per paragraf)" multiline onChange={setContent} placeholder="Isi satu paragraf di sini..." />
        </div>
        <div className="col-12">
          <label className="form-label d-block">Gambar Cover</label>
          <ImageUploader currentUrl={photoUrl} folder="news" label="Pilih Gambar" onUploaded={setPhotoUrl} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Terbitkan Berita"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/news")} type="button">Batal</button>
      </div>
    </form>
  );
}
