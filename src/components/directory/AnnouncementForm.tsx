"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AnnouncementItem } from "@/types/announcement";

const CATEGORY_SUGGESTIONS = ["Akademik", "PPDB", "Umum"];

export function AnnouncementForm({ initialData }: { initialData?: AnnouncementItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [isPinned, setIsPinned] = useState(initialData?.isPinned ?? false);
  const [content, setContent] = useState(initialData?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { title, category, date, is_pinned: isPinned, content };

    const { error: saveError } = isEdit
      ? await supabase.from("announcements").update(payload).eq("id", initialData!.id)
      : await supabase.from("announcements").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/announcements");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="title">Judul</label>
          <input className="form-control" id="title" onChange={(event) => setTitle(event.target.value)} required type="text" value={title} />
        </div>
        <div className="col-md-5">
          <label className="form-label" htmlFor="category">Kategori</label>
          <input className="form-control" id="category" list="announcement-category-suggestions" onChange={(event) => setCategory(event.target.value)} required type="text" value={category} />
          <datalist id="announcement-category-suggestions">{CATEGORY_SUGGESTIONS.map((item) => <option key={item} value={item} />)}</datalist>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="date">Tanggal</label>
          <input className="form-control" id="date" onChange={(event) => setDate(event.target.value)} required type="date" value={date} />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <div className="form-check">
            <input checked={isPinned} className="form-check-input" id="isPinned" onChange={(event) => setIsPinned(event.target.checked)} type="checkbox" />
            <label className="form-check-label" htmlFor="isPinned">Sematkan (penting)</label>
          </div>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="content">Isi Pengumuman</label>
          <textarea className="form-control" id="content" onChange={(event) => setContent(event.target.value)} required rows={4} value={content} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Pengumuman"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/announcements")} type="button">Batal</button>
      </div>
    </form>
  );
}
