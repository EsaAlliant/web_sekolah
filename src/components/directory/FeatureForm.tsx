"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { HomepageFeature } from "@/types/homepage";

const ICON_SUGGESTIONS = ["bi-mortarboard", "bi-person-badge", "bi-tools", "bi-briefcase", "bi-award", "bi-shield-check", "bi-lightbulb", "bi-people"];

export function FeatureForm({ initialData }: { initialData?: HomepageFeature }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? "bi-star");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { title, description, icon };

    const { error: saveError } = isEdit
      ? await supabase.from("homepage_features").update(payload).eq("id", initialData!.id)
      : await supabase.from("homepage_features").insert(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }

    router.push("/admin/features");
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
          <label className="form-label" htmlFor="icon">Ikon</label>
          <input className="form-control" id="icon" list="feature-icon-suggestions" onChange={(event) => setIcon(event.target.value)} type="text" value={icon} />
          <datalist id="feature-icon-suggestions">
            {ICON_SUGGESTIONS.map((item) => <option key={item} value={item} />)}
          </datalist>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="description">Deskripsi</label>
          <textarea className="form-control" id="description" onChange={(event) => setDescription(event.target.value)} required rows={3} value={description} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Fitur"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/features")} type="button">Batal</button>
      </div>
    </form>
  );
}
