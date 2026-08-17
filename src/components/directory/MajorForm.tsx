"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListInput } from "@/components/directory/ListInput";
import { createClient } from "@/lib/supabase/client";
import type { Major } from "@/types/academic";

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function MajorForm({ initialData }: { initialData?: Major }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [id, setId] = useState(initialData?.id ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [abbreviation, setAbbreviation] = useState(initialData?.abbreviation ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [duration, setDuration] = useState(initialData?.duration ?? "3 Tahun");
  const [icon, setIcon] = useState(initialData?.icon ?? "bi-mortarboard");
  const [competencies, setCompetencies] = useState<string[]>(initialData?.competencies ?? [""]);
  const [careerPaths, setCareerPaths] = useState<string[]>(initialData?.careerPaths ?? [""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const cleanId = isEdit ? initialData!.id : (id || slugify(name));
    const payload = {
      id: cleanId,
      name,
      abbreviation,
      description,
      duration,
      icon,
      competencies: competencies.filter(Boolean),
      career_paths: careerPaths.filter(Boolean),
    };

    const { error: saveError } = isEdit
      ? await supabase.from("majors").update(payload).eq("id", initialData!.id)
      : await supabase.from("majors").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/majors");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label" htmlFor="name">Nama Jurusan</label>
          <input className="form-control" id="name" onChange={(event) => setName(event.target.value)} required type="text" value={name} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="abbreviation">Singkatan</label>
          <input className="form-control" id="abbreviation" onChange={(event) => setAbbreviation(event.target.value)} required type="text" value={abbreviation} />
        </div>
        {!isEdit && (
          <div className="col-12">
            <label className="form-label" htmlFor="id">ID Unik (kosongkan biar otomatis dari nama)</label>
            <input className="form-control" id="id" onChange={(event) => setId(event.target.value)} placeholder="contoh: tkjt" type="text" value={id} />
          </div>
        )}
        <div className="col-md-6">
          <label className="form-label" htmlFor="duration">Lama Pendidikan</label>
          <input className="form-control" id="duration" onChange={(event) => setDuration(event.target.value)} required type="text" value={duration} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="icon">Ikon</label>
          <input className="form-control" id="icon" onChange={(event) => setIcon(event.target.value)} type="text" value={icon} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="description">Deskripsi</label>
          <textarea className="form-control" id="description" onChange={(event) => setDescription(event.target.value)} required rows={3} value={description} />
        </div>
        <div className="col-md-6">
          <ListInput items={competencies} label="Kompetensi" onChange={setCompetencies} placeholder="contoh: Jaringan komputer" />
        </div>
        <div className="col-md-6">
          <ListInput items={careerPaths} label="Prospek Karier" onChange={setCareerPaths} placeholder="contoh: Network Administrator" />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Jurusan"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/majors")} type="button">Batal</button>
      </div>
    </form>
  );
}
