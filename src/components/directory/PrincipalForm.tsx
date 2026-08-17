"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/directory/ImageUploader";
import { ListInput } from "@/components/directory/ListInput";
import { createClient } from "@/lib/supabase/client";
import type { PrincipalContent } from "@/types/about";

export function PrincipalForm({ initialData }: { initialData: PrincipalContent }) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name);
  const [positionPrefix, setPositionPrefix] = useState(initialData.positionPrefix);
  const [quote, setQuote] = useState(initialData.quote);
  const [emailPrefix, setEmailPrefix] = useState(initialData.emailPrefix);
  const [messages, setMessages] = useState<string[]>(initialData.messages.length > 0 ? initialData.messages : [""]);
  const [closing, setClosing] = useState(initialData.closing);
  const [photoUrl, setPhotoUrl] = useState(initialData.photoUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const payload = {
      name,
      position_prefix: positionPrefix,
      quote,
      email_prefix: emailPrefix,
      messages: messages.filter(Boolean),
      closing,
      photo_url: photoUrl ?? null,
    };

    const { error: saveError } = await supabase.from("principal_profile").update(payload).eq("id", 1);
    setSaving(false);

    if (saveError) { setError(saveError.message); return; }
    setSaved(true);
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="name">Nama Kepala Sekolah</label>
          <input className="form-control" id="name" onChange={(event) => setName(event.target.value)} required type="text" value={name} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="positionPrefix">Jabatan (Prefix)</label>
          <input className="form-control" id="positionPrefix" onChange={(event) => setPositionPrefix(event.target.value)} placeholder="contoh: Kepala" required type="text" value={positionPrefix} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="emailPrefix">Prefix Email</label>
          <input className="form-control" id="emailPrefix" onChange={(event) => setEmailPrefix(event.target.value)} placeholder="contoh: kepsek" type="text" value={emailPrefix} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="quote">Kutipan Singkat</label>
          <textarea className="form-control" id="quote" onChange={(event) => setQuote(event.target.value)} required rows={2} value={quote} />
        </div>
        <div className="col-12">
          <ListInput items={messages} label="Paragraf Sambutan" multiline onChange={setMessages} placeholder="Isi satu paragraf sambutan..." />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="closing">Kalimat Penutup</label>
          <input className="form-control" id="closing" onChange={(event) => setClosing(event.target.value)} placeholder="Hormat kami," required type="text" value={closing} />
        </div>
        <div className="col-12">
          <label className="form-label d-block">Foto Kepala Sekolah</label>
          <ImageUploader currentUrl={photoUrl} folder="principal" label="Pilih Foto" onUploaded={setPhotoUrl} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <button className="btn btn-primary mt-3" disabled={saving} type="submit">{saving ? "Menyimpan..." : "Simpan Sambutan"}</button>
      {saved && <span className="text-success small ms-2"><i aria-hidden="true" className="bi bi-check-circle" /> Tersimpan</span>}
    </form>
  );
}
