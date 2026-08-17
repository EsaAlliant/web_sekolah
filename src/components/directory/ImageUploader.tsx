"use client";

import { useState } from "react";
import { compressImage } from "@/lib/image-compress";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  folder: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
  maxSizeMb?: number;
  maxDimension?: number;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export function ImageUploader({ folder, currentUrl, onUploaded, label = "Unggah gambar", maxSizeMb = 5, maxDimension = 1600 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Format tidak didukung. Gunakan PNG, JPG, WebP, atau SVG.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSizeMb}MB.`);
      return;
    }

    setCompressing(true);
    let fileToUpload: File;
    try {
      fileToUpload = await compressImage(file, maxDimension);
    } catch {
      // Kalau kompresi gagal (misal file rusak), tetap coba unggah file asli
      fileToUpload = file;
    }
    setCompressing(false);

    setUploading(true);
    const supabase = createClient();
    const ext = fileToUpload.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("site-media").upload(path, fileToUpload, { upsert: true });

    if (uploadError) {
      setError(`Gagal unggah: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    setPreview(data.publicUrl);
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  const busy = compressing || uploading;
  const statusLabel = compressing ? "Mengompres..." : uploading ? "Mengunggah..." : label;

  return (
    <div className="image-uploader">
      {preview && (
        <div className="image-uploader-preview">
          <img alt="Pratinjau" src={preview} />
        </div>
      )}
      <label className="btn btn-outline-primary btn-sm image-uploader-btn">
        <i aria-hidden="true" className="bi bi-upload" /> {statusLabel}
        <input accept={ALLOWED_TYPES.join(",")} className="d-none" disabled={busy} onChange={handleFile} type="file" />
      </label>
      <p className="text-muted-strong small mt-1 mb-0">Otomatis dikecilkan bila lebih dari {maxDimension}px pada sisi terpanjang.</p>
      {error && <p className="text-danger small mt-1 mb-0">{error}</p>}
    </div>
  );
}
