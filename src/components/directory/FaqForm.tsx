"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { FaqItem } from "@/types/faq";

const CATEGORY_SUGGESTIONS = ["PPDB", "Akademik", "Umum"];

export function FaqForm({ initialData }: { initialData?: FaqItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [question, setQuestion] = useState(initialData?.question ?? "");
  const [answer, setAnswer] = useState(initialData?.answer ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { question, answer, category };

    const { error: saveError } = isEdit
      ? await supabase.from("faqs").update(payload).eq("id", initialData!.id)
      : await supabase.from("faqs").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/faq");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label" htmlFor="question">Pertanyaan</label>
          <input className="form-control" id="question" onChange={(event) => setQuestion(event.target.value)} required type="text" value={question} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="category">Kategori</label>
          <input className="form-control" id="category" list="faq-category-suggestions" onChange={(event) => setCategory(event.target.value)} required type="text" value={category} />
          <datalist id="faq-category-suggestions">{CATEGORY_SUGGESTIONS.map((item) => <option key={item} value={item} />)}</datalist>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="answer">Jawaban</label>
          <textarea className="form-control" id="answer" onChange={(event) => setAnswer(event.target.value)} required rows={3} value={answer} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah FAQ"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/faq")} type="button">Batal</button>
      </div>
    </form>
  );
}
