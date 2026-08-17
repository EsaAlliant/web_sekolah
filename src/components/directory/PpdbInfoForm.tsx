"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListInput } from "@/components/directory/ListInput";
import { createClient } from "@/lib/supabase/client";
import type { PpdbInfo, PpdbTimelineItem } from "@/types/ppdb";

export function PpdbInfoForm({ initialData }: { initialData: PpdbInfo }) {
  const router = useRouter();
  const [period, setPeriod] = useState(initialData.period);
  const [status, setStatus] = useState(initialData.status);
  const [quota, setQuota] = useState(initialData.quota);
  const [fee, setFee] = useState(initialData.fee);
  const [requirements, setRequirements] = useState<string[]>(initialData.requirements.length > 0 ? initialData.requirements : [""]);
  const [timeline, setTimeline] = useState<PpdbTimelineItem[]>(initialData.timeline.length > 0 ? initialData.timeline : [{ label: "", date: "" }]);
  const [steps, setSteps] = useState<string[]>(initialData.steps.length > 0 ? initialData.steps : [""]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTimeline = (index: number, field: keyof PpdbTimelineItem, value: string) => {
    const next = [...timeline];
    next[index] = { ...next[index], [field]: value };
    setTimeline(next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const payload = {
      period,
      status,
      quota,
      fee,
      requirements: requirements.filter(Boolean),
      timeline: timeline.filter((item) => item.label),
      steps: steps.filter(Boolean),
    };

    const { error: saveError } = await supabase.from("ppdb_info").update(payload).eq("id", 1);
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setSaved(true);
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label" htmlFor="period">Tahun Ajaran</label>
          <input className="form-control" id="period" onChange={(event) => setPeriod(event.target.value)} placeholder="2026/2027" required type="text" value={period} />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="status">Status</label>
          <select className="form-select" id="status" onChange={(event) => setStatus(event.target.value as PpdbInfo["status"])} value={status}>
            <option value="draft">Belum Dibuka</option>
            <option value="open">Dibuka</option>
            <option value="closed">Ditutup</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="quota">Kuota</label>
          <input className="form-control" id="quota" onChange={(event) => setQuota(event.target.value)} placeholder="144 Peserta Didik" type="text" value={quota} />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="fee">Biaya</label>
          <input className="form-control" id="fee" onChange={(event) => setFee(event.target.value)} placeholder="Gratis" type="text" value={fee} />
        </div>
      </div>

      <ListInput items={requirements} label="Berkas Persyaratan" onChange={setRequirements} placeholder="contoh: Fotokopi Kartu Keluarga" />

      <label className="form-label d-block mt-4">Jadwal Penting (Timeline)</label>
      <div className="d-grid gap-2">
        {timeline.map((item, index) => (
          <div className="row g-2" key={index}>
            <div className="col-6"><input className="form-control" onChange={(event) => updateTimeline(index, "label", event.target.value)} placeholder="Nama tahapan" type="text" value={item.label} /></div>
            <div className="col-6"><input className="form-control" onChange={(event) => updateTimeline(index, "date", event.target.value)} placeholder="Tanggal, contoh: 1-30 Juni 2026" type="text" value={item.date} /></div>
          </div>
        ))}
      </div>
      <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => setTimeline([...timeline, { label: "", date: "" }])} type="button">
        <i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Jadwal
      </button>

      <div className="mt-4">
        <ListInput items={steps} label="Alur Pendaftaran" multiline onChange={setSteps} placeholder="Isi satu langkah pendaftaran..." />
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="mt-4">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : "Simpan Info PPDB"}</button>
        {saved && <span className="text-success small ms-2"><i aria-hidden="true" className="bi bi-check-circle" /> Tersimpan</span>}
      </div>
    </form>
  );
}
