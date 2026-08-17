"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CurriculumComponent, CurriculumContent, CurriculumGrade } from "@/types/academic";

export function CurriculumForm({ initialData }: { initialData: CurriculumContent }) {
  const router = useRouter();
  const [framework, setFramework] = useState(initialData.framework);
  const [intro, setIntro] = useState(initialData.intro);
  const [profile, setProfile] = useState(initialData.profile);
  const [components, setComponents] = useState<CurriculumComponent[]>(initialData.components.length > 0 ? initialData.components : [{ title: "", portion: "", description: "", icon: "bi-book" }]);
  const [structure, setStructure] = useState<CurriculumGrade[]>(initialData.structure.length > 0 ? initialData.structure : [{ grade: "", title: "", description: "" }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateComponent = (index: number, field: keyof CurriculumComponent, value: string) => {
    const next = [...components];
    next[index] = { ...next[index], [field]: value };
    setComponents(next);
  };
  const updateStructure = (index: number, field: keyof CurriculumGrade, value: string) => {
    const next = [...structure];
    next[index] = { ...next[index], [field]: value };
    setStructure(next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const payload = {
      framework,
      intro,
      curriculum_name: profile.curriculumName,
      schedule: profile.schedule,
      data_semester: profile.dataSemester,
      internet_access: profile.internetAccess,
      electricity_source: profile.electricitySource,
      electricity_power: profile.electricityPower,
      land_area: profile.landArea,
      components: components.filter((item) => item.title),
      structure: structure.filter((item) => item.grade),
    };

    const { error: saveError } = await supabase.from("curriculum_profile").update(payload).eq("id", 1);
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setSaved(true);
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <h2 className="h6 mb-3">Umum</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label" htmlFor="framework">Nama Kurikulum</label>
          <input className="form-control" id="framework" onChange={(event) => setFramework(event.target.value)} required type="text" value={framework} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="intro">Paragraf Pembuka</label>
          <textarea className="form-control" id="intro" onChange={(event) => setIntro(event.target.value)} rows={2} value={intro} />
        </div>
      </div>

      <h2 className="h6 mb-3">Kurikulum dan Utilitas</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label">Kurikulum</label>
          <input className="form-control" onChange={(event) => setProfile({ ...profile, curriculumName: event.target.value })} type="text" value={profile.curriculumName} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Penyelenggaraan</label>
          <input className="form-control" onChange={(event) => setProfile({ ...profile, schedule: event.target.value })} type="text" value={profile.schedule} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Semester Data</label>
          <input className="form-control" onChange={(event) => setProfile({ ...profile, dataSemester: event.target.value })} type="text" value={profile.dataSemester} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Akses Internet</label>
          <input className="form-control" onChange={(event) => setProfile({ ...profile, internetAccess: event.target.value })} type="text" value={profile.internetAccess} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Sumber Listrik</label>
          <input className="form-control" onChange={(event) => setProfile({ ...profile, electricitySource: event.target.value })} type="text" value={profile.electricitySource} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Daya Listrik</label>
          <input className="form-control" onChange={(event) => setProfile({ ...profile, electricityPower: event.target.value })} type="text" value={profile.electricityPower} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Luas Tanah</label>
          <input className="form-control" onChange={(event) => setProfile({ ...profile, landArea: event.target.value })} type="text" value={profile.landArea} />
        </div>
      </div>

      <h2 className="h6 mb-3">Komponen Pembelajaran</h2>
      <div className="d-grid gap-2 mb-4">
        {components.map((component, index) => (
          <div className="history-milestone-row" key={index}>
            <div className="row g-2">
              <div className="col-md-4"><input className="form-control" onChange={(event) => updateComponent(index, "title", event.target.value)} placeholder="Judul" type="text" value={component.title} /></div>
              <div className="col-md-2"><input className="form-control" onChange={(event) => updateComponent(index, "portion", event.target.value)} placeholder="Persentase" type="text" value={component.portion} /></div>
              <div className="col-md-4"><input className="form-control" onChange={(event) => updateComponent(index, "description", event.target.value)} placeholder="Deskripsi" type="text" value={component.description} /></div>
              <div className="col-md-2"><input className="form-control" onChange={(event) => updateComponent(index, "icon", event.target.value)} placeholder="Ikon" type="text" value={component.icon} /></div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-outline-primary btn-sm mb-4" onClick={() => setComponents([...components, { title: "", portion: "", description: "", icon: "bi-book" }])} type="button">
        <i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Komponen
      </button>

      <h2 className="h6 mb-3">Tahapan Belajar</h2>
      <div className="d-grid gap-2 mb-3">
        {structure.map((grade, index) => (
          <div className="history-milestone-row" key={index}>
            <div className="row g-2">
              <div className="col-md-3"><input className="form-control" onChange={(event) => updateStructure(index, "grade", event.target.value)} placeholder="Kelas" type="text" value={grade.grade} /></div>
              <div className="col-md-4"><input className="form-control" onChange={(event) => updateStructure(index, "title", event.target.value)} placeholder="Judul" type="text" value={grade.title} /></div>
              <div className="col-md-5"><input className="form-control" onChange={(event) => updateStructure(index, "description", event.target.value)} placeholder="Deskripsi" type="text" value={grade.description} /></div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-outline-primary btn-sm" onClick={() => setStructure([...structure, { grade: "", title: "", description: "" }])} type="button">
        <i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Tahapan
      </button>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="mt-4">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : "Simpan Kurikulum"}</button>
        {saved && <span className="text-success small ms-2"><i aria-hidden="true" className="bi bi-check-circle" /> Tersimpan</span>}
      </div>
    </form>
  );
}
