"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentUploader } from "@/components/directory/DocumentUploader";
import { createClient } from "@/lib/supabase/client";
import type { DownloadItem } from "@/types/download";

const CATEGORY_SUGGESTIONS = ["PPDB", "Akademik", "Kurikulum", "Administrasi", "Umum"];

export function DownloadForm({ initialData }: { initialData?: DownloadItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl && initialData.fileUrl !== "#" ? initialData.fileUrl : undefined);
  const [fileType, setFileType] = useState<DownloadItem["fileType"]>(initialData?.fileType ?? "pdf");
  const [fileSize, setFileSize] = useState(initialData?.fileSize ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    if (!fileUrl) {
      setError("Silakan unggah dokumen terlebih dahulu.");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    const payload = {
      title,
      category,
      description,
      file_url: fileUrl,
      file_type: fileType,
      file_size: fileSize,
      updated_date: new Date().toISOString().slice(0, 10),
    };

    const { error: saveError } = isEdit
      ? await supabase.from("downloads").update(payload).eq("id", initialData!.id)
      : await supabase.from("downloads").insert(payload);

    setSaving(false);
    if (saveError) { setError(saveError.message); return; }

    router.push("/admin/downloads");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label" htmlFor="title">Judul Dokumen</label>
          <input className="form-control" id="title" onChange={(event) => setTitle(event.target.value)} required type="text" value={title} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="category">Kategori</label>
          <input className="form-control" id="category" list="download-category-suggestions" onChange={(event) => setCategory(event.target.value)} required type="text" value={category} />
          <datalist id="download-category-suggestions">{CATEGORY_SUGGESTIONS.map((item) => <option key={item} value={item} />)}</datalist>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="description">Deskripsi</label>
          <textarea className="form-control" id="description" onChange={(event) => setDescription(event.target.value)} required rows={2} value={description} />
        </div>
        <div className="col-12">
          <label className="form-label d-block">File Dokumen</label>
          <DocumentUploader
            currentFileName={initialData?.title}
            currentUrl={fileUrl}
            folder="downloads"
            onUploaded={(result) => { setFileUrl(result.url); setFileType(result.fileType); setFileSize(result.sizeLabel); }}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Dokumen"}</button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/downloads")} type="button">Batal</button>
      </div>
    </form>
  );
}
