"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LegalPageSlug, LegalSection } from "@/types/legal";

export function LegalPageForm({ page, initialData }: { page: LegalPageSlug; initialData: LegalSection[] }) {
  const router = useRouter();
  const [sections, setSections] = useState<LegalSection[]>(
    initialData.length > 0 ? initialData : [{ heading: "", body: "" }],
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSection = (index: number, field: "heading" | "body", value: string) => {
    const next = [...sections];
    next[index] = { ...next[index], [field]: value };
    setSections(next);
  };

  const removeSection = (index: number) => setSections(sections.filter((_, i) => i !== index));
  const addSection = () => setSections([...sections, { heading: "", body: "" }]);

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const cleaned = sections.filter((item) => item.heading.trim() && item.body.trim());

    // Sama kayak pola di HistoryForm: hapus semua baris lama untuk halaman
    // ini, lalu insert ulang sesuai urutan yang sekarang. Lebih simpel
    // daripada diffing per-id karena section legal nggak direferensikan
    // dari tabel lain.
    const { error: deleteError } = await supabase.from("legal_page_sections").delete().eq("page", page);
    const { error: insertError } = cleaned.length > 0
      ? await supabase.from("legal_page_sections").insert(
          cleaned.map((item, index) => ({ page, heading: item.heading, body: item.body, sort_order: index })),
        )
      : { error: null };

    setSaving(false);
    const saveError = deleteError || insertError;
    if (saveError) { setError(saveError.message); return; }
    setSaved(true);
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <p className="text-muted-strong small mb-3">
        Tips: baris yang diawali tanda <code>- </code> otomatis jadi poin daftar. Bisa juga pakai{" "}
        <code>{"{{name}}"}</code>, <code>{"{{shortName}}"}</code>, atau <code>{"{{email}}"}</code> di dalam isi —
        otomatis diganti data sekolah asli dari menu Pengaturan Situs.
      </p>

      <div className="d-grid gap-3">
        {sections.map((section, index) => (
          <div className="admin-stat-card text-start" key={index}>
            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
              <input
                className="form-control"
                onChange={(event) => updateSection(index, "heading", event.target.value)}
                placeholder={`Judul bagian ${index + 1}, mis. "Data yang Kami Kumpulkan"`}
                type="text"
                value={section.heading}
              />
              <div className="d-flex gap-1 flex-shrink-0">
                <button className="btn btn-outline-secondary btn-sm" disabled={index === 0} onClick={() => moveSection(index, -1)} title="Naikkan urutan" type="button">
                  <i aria-hidden="true" className="bi bi-arrow-up" />
                </button>
                <button className="btn btn-outline-secondary btn-sm" disabled={index === sections.length - 1} onClick={() => moveSection(index, 1)} title="Turunkan urutan" type="button">
                  <i aria-hidden="true" className="bi bi-arrow-down" />
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => removeSection(index)} title="Hapus bagian" type="button">
                  <i aria-hidden="true" className="bi bi-trash" />
                </button>
              </div>
            </div>
            <textarea
              className="form-control"
              onChange={(event) => updateSection(index, "body", event.target.value)}
              placeholder="Isi bagian ini..."
              rows={4}
              value={section.body}
            />
          </div>
        ))}
      </div>

      <button className="btn btn-outline-primary btn-sm mt-3" onClick={addSection} type="button">
        <i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Bagian
      </button>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="mt-4">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : "Simpan Perubahan"}</button>
        {saved && <span className="text-success small ms-2"><i aria-hidden="true" className="bi bi-check-circle" /> Tersimpan</span>}
      </div>
    </form>
  );
}
