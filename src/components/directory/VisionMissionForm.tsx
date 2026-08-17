"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListInput } from "@/components/directory/ListInput";
import { createClient } from "@/lib/supabase/client";
import type { MissionValue, VisionMissionContent } from "@/types/about";

export function VisionMissionForm({ initialData }: { initialData: VisionMissionContent }) {
  const router = useRouter();
  const [vision, setVision] = useState(initialData.vision);
  const [missions, setMissions] = useState<string[]>(initialData.missions.length > 0 ? initialData.missions : [""]);
  const [values, setValues] = useState<MissionValue[]>(initialData.values.length > 0 ? initialData.values : [{ label: "", icon: "bi-star" }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateValue = (index: number, field: keyof MissionValue, value: string) => {
    const next = [...values];
    next[index] = { ...next[index], [field]: value };
    setValues(next);
  };
  const removeValue = (index: number) => setValues(values.filter((_, i) => i !== index));
  const addValue = () => setValues([...values, { label: "", icon: "bi-star" }]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const payload = { vision, missions: missions.filter(Boolean), core_values: values.filter((item) => item.label) };
    const { error: saveError } = await supabase.from("vision_mission").update(payload).eq("id", 1);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setSaved(true);
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="vision">Visi</label>
      <textarea className="form-control mb-4" id="vision" onChange={(event) => setVision(event.target.value)} required rows={2} value={vision} />

      <ListInput items={missions} label="Misi" multiline onChange={setMissions} placeholder="Isi satu poin misi..." />

      <label className="form-label d-block mt-4">Nilai Utama</label>
      <div className="d-grid gap-2">
        {values.map((value, index) => (
          <div className="row g-2" key={index}>
            <div className="col-6">
              <input className="form-control" onChange={(event) => updateValue(index, "label", event.target.value)} placeholder="Label, contoh: Integritas" type="text" value={value.label} />
            </div>
            <div className="col-4">
              <input className="form-control" onChange={(event) => updateValue(index, "icon", event.target.value)} placeholder="bi-shield-check" type="text" value={value.icon} />
            </div>
            <div className="col-2">
              <button className="btn btn-outline-danger btn-sm w-100" onClick={() => removeValue(index)} type="button"><i aria-hidden="true" className="bi bi-x-lg" /></button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-outline-primary btn-sm mt-2" onClick={addValue} type="button"><i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Nilai</button>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="mt-4">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : "Simpan Visi Misi"}</button>
        {saved && <span className="text-success small ms-2"><i aria-hidden="true" className="bi bi-check-circle" /> Tersimpan</span>}
      </div>
    </form>
  );
}
