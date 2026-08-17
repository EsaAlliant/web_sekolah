"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { HistoryContent, HistoryMilestone } from "@/types/about";

export function HistoryForm({ initialData }: { initialData: HistoryContent }) {
  const router = useRouter();
  const [intro, setIntro] = useState(initialData.intro);
  const [milestones, setMilestones] = useState<HistoryMilestone[]>(initialData.milestones.length > 0 ? initialData.milestones : [{ year: "", title: "", description: "" }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMilestone = (index: number, field: keyof HistoryMilestone, value: string) => {
    const next = [...milestones];
    next[index] = { ...next[index], [field]: value };
    setMilestones(next);
  };

  const removeMilestone = (index: number) => setMilestones(milestones.filter((_, i) => i !== index));
  const addMilestone = () => setMilestones([...milestones, { year: "", title: "", description: "" }]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const cleaned = milestones.filter((item) => item.year && item.title);

    const { error: introError } = await supabase.from("history_profile").update({ intro }).eq("id", 1);
    const { error: deleteError } = await supabase.from("history_milestones").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: insertError } = cleaned.length > 0
      ? await supabase.from("history_milestones").insert(cleaned.map((item, index) => ({ ...item, sort_order: index })))
      : { error: null };

    setSaving(false);
    const saveError = introError || deleteError || insertError;
    if (saveError) { setError(saveError.message); return; }
    setSaved(true);
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="intro">Paragraf Pembuka</label>
      <textarea className="form-control mb-4" id="intro" onChange={(event) => setIntro(event.target.value)} required rows={3} value={intro} />

      <label className="form-label d-block">Rangkaian Sejarah (Timeline)</label>
      <div className="d-grid gap-3">
        {milestones.map((milestone, index) => (
          <div className="history-milestone-row" key={index}>
            <div className="row g-2">
              <div className="col-md-2">
                <input className="form-control" onChange={(event) => updateMilestone(index, "year", event.target.value)} placeholder="Tahun" type="text" value={milestone.year} />
              </div>
              <div className="col-md-4">
                <input className="form-control" onChange={(event) => updateMilestone(index, "title", event.target.value)} placeholder="Judul kejadian" type="text" value={milestone.title} />
              </div>
              <div className="col-md-5">
                <input className="form-control" onChange={(event) => updateMilestone(index, "description", event.target.value)} placeholder="Deskripsi singkat" type="text" value={milestone.description} />
              </div>
              <div className="col-md-1">
                <button className="btn btn-outline-danger btn-sm w-100" onClick={() => removeMilestone(index)} type="button">
                  <i aria-hidden="true" className="bi bi-x-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-outline-primary btn-sm mt-2" onClick={addMilestone} type="button">
        <i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Tahun
      </button>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="mt-4">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : "Simpan Sejarah"}</button>
        {saved && <span className="text-success small ms-2"><i aria-hidden="true" className="bi bi-check-circle" /> Tersimpan</span>}
      </div>
    </form>
  );
}
