"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AgendaEvent } from "@/types/agenda";

const CATEGORY_SUGGESTIONS = ["Akademik", "Kesiswaan", "Umum", "PPDB"];

export function AgendaForm({ initialData }: { initialData?: AgendaEvent }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [startDate, setStartDate] = useState(initialData?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialData?.endDate ?? "");
  const [time, setTime] = useState(initialData?.time ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { title, start_date: startDate, end_date: endDate || null, time: time || null, location, category, description };

    const { error: saveError } = isEdit
      ? await supabase.from("agenda_events").update(payload).eq("id", initialData!.id)
      : await supabase.from("agenda_events").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/agenda");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="title">Judul Kegiatan</label>
          <input className="form-control" id="title" onChange={(event) => setTitle(event.target.value)} required type="text" value={title} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="startDate">Tanggal Mulai</label>
          <input className="form-control" id="startDate" onChange={(event) => setStartDate(event.target.value)} required type="date" value={startDate} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="endDate">Tanggal Selesai (opsional)</label>
          <input className="form-control" id="endDate" onChange={(event) => setEndDate(event.target.value)} type="date" value={endDate} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="time">Waktu (opsional)</label>
          <input className="form-control" id="time" onChange={(event) => setTime(event.target.value)} placeholder="07.00 WIB" type="text" value={time} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="location">Lokasi</label>
          <input className="form-control" id="location" onChange={(event) => setLocation(event.target.value)} required type="text" value={location} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="category">Kategori</label>
          <input className="form-control" id="category" list="agenda-category-suggestions" onChange={(event) => setCategory(event.target.value)} required type="text" value={category} />
          <datalist id="agenda-category-suggestions">{CATEGORY_SUGGESTIONS.map((item) => <option key={item} value={item} />)}</datalist>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="description">Deskripsi</label>
          <textarea className="form-control" id="description" onChange={(event) => setDescription(event.target.value)} required rows={3} value={description} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Agenda"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/agenda")} type="button">Batal</button>
      </div>
    </form>
  );
}
