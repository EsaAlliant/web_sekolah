"use client";

import { useState } from "react";
import type { Major } from "@/types/academic";
import { createClient } from "@/lib/supabase/client";

interface FormState {
  fullName: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  previousSchool: string;
  address: string;
  parentName: string;
  parentPhone: string;
  majorId: string;
  notes: string;
}

const initialState: FormState = {
  fullName: "",
  gender: "",
  birthPlace: "",
  birthDate: "",
  previousSchool: "",
  address: "",
  parentName: "",
  parentPhone: "",
  majorId: "",
  notes: "",
};

export function PpdbForm({ majors, whatsappUrl }: { majors: Major[]; whatsappUrl: string }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const major = majors.find((item) => item.id === form.majorId);

    setSaving(true);
    setSaveError(false);

    const supabase = createClient();
    const { error } = await supabase.from("ppdb_submissions").insert({
      full_name: form.fullName,
      gender: form.gender,
      birth_place: form.birthPlace,
      birth_date: form.birthDate || null,
      previous_school: form.previousSchool,
      address: form.address,
      parent_name: form.parentName,
      parent_phone: form.parentPhone,
      major_id: form.majorId || null,
      notes: form.notes || null,
    });

    setSaving(false);
    if (error) {
      console.error("Gagal menyimpan pendaftaran PPDB:", error.message);
      setSaveError(true);
    }

    const message = [
      "Assalamu'alaikum, saya ingin mendaftar PPDB dengan data berikut:",
      "",
      `Nama Lengkap: ${form.fullName}`,
      `Jenis Kelamin: ${form.gender}`,
      `Tempat, Tanggal Lahir: ${form.birthPlace}, ${form.birthDate}`,
      `Asal Sekolah: ${form.previousSchool}`,
      `Alamat: ${form.address}`,
      `Nama Orang Tua/Wali: ${form.parentName}`,
      `No. HP Orang Tua/Wali: ${form.parentPhone}`,
      `Pilihan Jurusan: ${major ? major.name : "-"}`,
      form.notes ? `Catatan: ${form.notes}` : undefined,
      "",
      "Mohon informasi tahapan selanjutnya. Terima kasih.",
    ].filter(Boolean).join("\n");

    const separator = whatsappUrl.includes("?") ? "&" : "?";
    window.open(`${whatsappUrl}${separator}text=${encodeURIComponent(message)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="fullName">Nama Lengkap</label>
          <input className="form-control" id="fullName" onChange={update("fullName")} required type="text" value={form.fullName} />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="gender">Jenis Kelamin</label>
          <select className="form-select" id="gender" onChange={update("gender")} required value={form.gender}>
            <option value="">Pilih</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="birthDate">Tanggal Lahir</label>
          <input className="form-control" id="birthDate" onChange={update("birthDate")} required type="date" value={form.birthDate} />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="birthPlace">Tempat Lahir</label>
          <input className="form-control" id="birthPlace" onChange={update("birthPlace")} required type="text" value={form.birthPlace} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="previousSchool">Asal Sekolah</label>
          <input className="form-control" id="previousSchool" onChange={update("previousSchool")} required type="text" value={form.previousSchool} />
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="address">Alamat Lengkap</label>
          <textarea className="form-control" id="address" onChange={update("address")} required rows={2} value={form.address} />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="parentName">Nama Orang Tua/Wali</label>
          <input className="form-control" id="parentName" onChange={update("parentName")} required type="text" value={form.parentName} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="parentPhone">No. HP Orang Tua/Wali</label>
          <input className="form-control" id="parentPhone" onChange={update("parentPhone")} required type="tel" value={form.parentPhone} />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="majorId">Pilihan Jurusan</label>
          <select className="form-select" id="majorId" onChange={update("majorId")} required value={form.majorId}>
            <option value="">Pilih Jurusan</option>
            {majors.map((major) => (
              <option key={major.id} value={major.id}>{major.name} ({major.abbreviation})</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="notes">Catatan (opsional)</label>
          <input className="form-control" id="notes" onChange={update("notes")} type="text" value={form.notes} />
        </div>
      </div>

      <button className="btn btn-primary btn-lg ppdb-submit" disabled={saving} type="submit">
        <i aria-hidden="true" className="bi bi-whatsapp" /> {saving ? "Menyimpan..." : "Kirim Pendaftaran via WhatsApp"}
      </button>

      {saveError && (
        <p className="ppdb-form-note ppdb-form-error">
          <i aria-hidden="true" className="bi bi-exclamation-triangle" /> Data gagal tersimpan ke database, tapi pesan WhatsApp tetap terkirim. Panitia akan tetap memproses dari WhatsApp.
        </p>
      )}

      {submitted && !saveError && (
        <p className="ppdb-form-note">
          <i aria-hidden="true" className="bi bi-info-circle" /> Kalau jendela WhatsApp tidak otomatis terbuka, pastikan pop-up tidak diblokir browser, lalu coba kirim ulang.
        </p>
      )}
    </form>
  );
}
