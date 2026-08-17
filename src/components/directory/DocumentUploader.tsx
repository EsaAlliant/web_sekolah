"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface DocumentUploaderProps {
  folder: string;
  currentUrl?: string;
  currentFileName?: string;
  onUploaded: (result: { url: string; fileName: string; sizeLabel: string; fileType: "pdf" | "docx" | "xlsx" }) => void;
  maxSizeMb?: number;
}

const ALLOWED_TYPES: Record<string, "pdf" | "docx" | "xlsx"> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploader({ folder, currentUrl, currentFileName, onUploaded, maxSizeMb = 10 }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState(currentFileName);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const fileType = ALLOWED_TYPES[file.type];

    if (!fileType) {
      setError("Format tidak didukung. Gunakan PDF, DOCX, atau XLSX.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSizeMb}MB.`);
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, { upsert: true });

    if (uploadError) {
      setError(`Gagal unggah: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    setFileName(file.name);
    onUploaded({ url: data.publicUrl, fileName: file.name, sizeLabel: formatSize(file.size), fileType });
    setUploading(false);
  };

  return (
    <div className="image-uploader">
      {currentUrl && fileName && (
        <p className="mb-2 small"><i aria-hidden="true" className="bi bi-file-earmark-check text-success" /> {fileName}</p>
      )}
      <label className="btn btn-outline-primary btn-sm image-uploader-btn">
        <i aria-hidden="true" className="bi bi-upload" /> {uploading ? "Mengunggah..." : "Pilih Dokumen"}
        <input accept=".pdf,.docx,.xlsx" className="d-none" disabled={uploading} onChange={handleFile} type="file" />
      </label>
      {error && <p className="text-danger small mt-1 mb-0">{error}</p>}
    </div>
  );
}
