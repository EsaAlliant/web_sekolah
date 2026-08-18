"use client";

import { useRef, useState } from "react";
import type { Major } from "@/types/academic";
import { createClient } from "@/lib/supabase/client";
import {
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
  INCOME_OPTIONS,
  JOB_OPTIONS,
  LIVING_ARRANGEMENT_OPTIONS,
  REGISTRATION_TYPE_OPTIONS,
  TRANSPORTATION_OPTIONS,
} from "@/constants/ppdb-options";

interface FormState {
  // Sesi 1 - Data Diri Peserta Didik
  registrationType: string;
  fullName: string;
  gender: string;
  kkNumber: string;
  nik: string;
  previousSchool: string;
  birthPlace: string;
  birthDate: string;
  religion: string;
  address: string;
  rtRw: string;
  dusun: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  livingArrangement: string;
  transportation: string;
  childOrder: string;
  phone: string;
  email: string;
  hobby: string;
  ambition: string;
  majorId: string;
  // Sesi 2 - Data Ayah Kandung
  fatherName: string;
  fatherNik: string;
  fatherBirthYear: string;
  fatherEducation: string;
  fatherJob: string;
  fatherIncome: string;
  // Sesi 3 - Data Ibu Kandung
  motherName: string;
  motherNik: string;
  motherBirthYear: string;
  motherEducation: string;
  motherJob: string;
  motherIncome: string;
  // Sesi 4 - Data Wali (opsional)
  guardianName: string;
  guardianNik: string;
  guardianBirthYear: string;
  guardianEducation: string;
  guardianJob: string;
  guardianIncome: string;
}

const initialState: FormState = {
  registrationType: "", fullName: "", gender: "", kkNumber: "", nik: "", previousSchool: "",
  birthPlace: "", birthDate: "",
  religion: "", address: "", rtRw: "", dusun: "", village: "", district: "", regency: "",
  province: "", postalCode: "", livingArrangement: "", transportation: "", childOrder: "",
  phone: "", email: "", hobby: "", ambition: "", majorId: "",
  fatherName: "", fatherNik: "", fatherBirthYear: "", fatherEducation: "", fatherJob: "", fatherIncome: "",
  motherName: "", motherNik: "", motherBirthYear: "", motherEducation: "", motherJob: "", motherIncome: "",
  guardianName: "", guardianNik: "", guardianBirthYear: "", guardianEducation: "", guardianJob: "", guardianIncome: "",
};

const STEP_LABELS = ["Data Diri", "Data Ayah", "Data Ibu", "Data Wali"];
const TOTAL_STEPS = STEP_LABELS.length;

export function PpdbForm({ majors, sheetWebhookUrl }: { majors: Major[]; sheetWebhookUrl: string }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [sheetError, setSheetError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<Array<HTMLFieldSetElement | null>>([]);

  const update = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Validasi cuma field-field di sesi yang sedang aktif, bukan seluruh form.
  // Field di sesi lain masih ada di DOM (cuma disembunyikan pakai d-none) jadi
  // reportValidity() di seluruh <form> bisa ke-block gara-gara field sesi lain
  // yang belum diisi. Makanya kita validasi per-fieldset pakai ref.
  const validateStep = (stepIndex: number) => {
    const fieldset = stepRefs.current[stepIndex];
    if (!fieldset) return true;
    const controls = fieldset.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
    for (const control of Array.from(controls)) {
      if (!control.checkValidity()) {
        control.reportValidity();
        control.focus();
        return false;
      }
    }
    return true;
  };

  const goToStep = (target: number) => {
    if (target > step && !validateStep(step - 1)) return;
    setStep(target);
    window.scrollTo({ top: (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 100, behavior: "smooth" });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep(step - 1)) return;

    const major = majors.find((item) => item.id === form.majorId);

    setSaving(true);
    setSaveError(false);
    setSheetError(false);

    const supabase = createClient();
    const { error } = await supabase.from("ppdb_submissions").insert({
      registration_type: form.registrationType,
      full_name: form.fullName,
      gender: form.gender,
      kk_number: form.kkNumber,
      nik: form.nik,
      previous_school: form.previousSchool,
      birth_place: form.birthPlace,
      birth_date: form.birthDate,
      religion: form.religion,
      address: form.address,
      rt_rw: form.rtRw,
      dusun: form.dusun,
      village: form.village,
      district: form.district,
      regency: form.regency,
      province: form.province,
      postal_code: form.postalCode,
      living_arrangement: form.livingArrangement,
      transportation: form.transportation,
      child_order: form.childOrder,
      phone: form.phone,
      email: form.email,
      hobby: form.hobby,
      ambition: form.ambition,
      major_id: form.majorId || null,
      father_name: form.fatherName,
      father_nik: form.fatherNik,
      father_birth_year: form.fatherBirthYear,
      father_education: form.fatherEducation,
      father_job: form.fatherJob,
      father_income: form.fatherIncome,
      mother_name: form.motherName,
      mother_nik: form.motherNik,
      mother_birth_year: form.motherBirthYear,
      mother_education: form.motherEducation,
      mother_job: form.motherJob,
      mother_income: form.motherIncome,
      guardian_name: form.guardianName || null,
      guardian_nik: form.guardianNik || null,
      guardian_birth_year: form.guardianBirthYear || null,
      guardian_education: form.guardianEducation || null,
      guardian_job: form.guardianJob || null,
      guardian_income: form.guardianIncome || null,
    });

    if (error) {
      console.error("Gagal menyimpan pendaftaran PPDB:", error.message);
      setSaveError(true);
    }

    if (sheetWebhookUrl) {
      try {
        await fetch(sheetWebhookUrl, {
          body: JSON.stringify({
            waktu_daftar: new Date().toISOString(),
            jenis_pendaftaran: form.registrationType,
            nama_lengkap: form.fullName,
            jenis_kelamin: form.gender,
            no_kk: form.kkNumber,
            nik: form.nik,
            asal_sekolah: form.previousSchool,
            tempat_lahir: form.birthPlace,
            tanggal_lahir: form.birthDate,
            agama: form.religion,
            alamat: form.address,
            rt_rw: form.rtRw,
            dusun: form.dusun,
            kelurahan_desa: form.village,
            kecamatan: form.district,
            kabupaten_kota: form.regency,
            propinsi: form.province,
            kode_pos: form.postalCode,
            jenis_tinggal: form.livingArrangement,
            transportasi: form.transportation,
            anak_ke: form.childOrder,
            no_hp: form.phone,
            email: form.email,
            hobi: form.hobby,
            cita_cita: form.ambition,
            pilihan_jurusan: major ? `${major.name} (${major.abbreviation})` : "",
            nama_ayah: form.fatherName,
            nik_ayah: form.fatherNik,
            tahun_lahir_ayah: form.fatherBirthYear,
            pendidikan_ayah: form.fatherEducation,
            pekerjaan_ayah: form.fatherJob,
            penghasilan_ayah: form.fatherIncome,
            nama_ibu: form.motherName,
            nik_ibu: form.motherNik,
            tahun_lahir_ibu: form.motherBirthYear,
            pendidikan_ibu: form.motherEducation,
            pekerjaan_ibu: form.motherJob,
            penghasilan_ibu: form.motherIncome,
            nama_wali: form.guardianName,
            nik_wali: form.guardianNik,
            tahun_lahir_wali: form.guardianBirthYear,
            pendidikan_wali: form.guardianEducation,
            pekerjaan_wali: form.guardianJob,
            penghasilan_wali: form.guardianIncome,
          }),
          // Apps Script Web App tidak mengirim header CORS, jadi request harus
          // "no-cors" + Content-Type text/plain (biar tidak kena preflight).
          // Konsekuensinya: kita tidak bisa baca isi respons (opaque response),
          // jadi tidak bisa memastikan 100% berhasil dari sisi browser — tapi
          // datanya tetap aman tersimpan di database Supabase di atas.
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          method: "POST",
          mode: "no-cors",
        });
      } catch (sheetErr) {
        console.error("Gagal mengirim ke Google Sheets:", sheetErr);
        setSheetError(true);
      }
    } else {
      console.warn("PPDB: URL Google Sheets belum diatur di Pengaturan Situs.");
      setSheetError(true);
    }

    setSaving(false);
    setSubmitted(true);
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit} ref={formRef}>
      <ol className="ppdb-wizard-steps">
        {STEP_LABELS.map((label, index) => {
          const current = index + 1;
          return (
            <li
              className={`ppdb-wizard-step ${current === step ? "is-active" : ""} ${current < step ? "is-done" : ""}`}
              key={label}
            >
              <button className="ppdb-wizard-step-btn" onClick={() => goToStep(current)} type="button">
                <span className="ppdb-wizard-step-number">{current < step ? <i aria-hidden="true" className="bi bi-check-lg" /> : current}</span>
                <span className="ppdb-wizard-step-label">Sesi {current}<br /><small>{label}</small></span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Sesi 1 - Data Diri Peserta Didik */}
      <fieldset className={step === 1 ? "" : "d-none"} ref={(el) => { stepRefs.current[0] = el; }}>
        <legend className="ppdb-session-title">Sesi 1: Data Diri Peserta Didik</legend>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label" htmlFor="registrationType">Jenis Pendaftaran</label>
            <select className="form-select" id="registrationType" onChange={update("registrationType")} required value={form.registrationType}>
              <option value="">Pilih</option>
              {REGISTRATION_TYPE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-8">
            <label className="form-label" htmlFor="fullName">Nama Lengkap</label>
            <input className="form-control" id="fullName" onChange={update("fullName")} required type="text" value={form.fullName} />
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="gender">Jenis Kelamin</label>
            <select className="form-select" id="gender" onChange={update("gender")} required value={form.gender}>
              <option value="">Pilih</option>
              {GENDER_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="childOrder">Anak Keberapa (berdasarkan KK)</label>
            <input className="form-control" id="childOrder" onChange={update("childOrder")} required type="text" value={form.childOrder} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="kkNumber">Nomor Kartu Keluarga</label>
            <input className="form-control" id="kkNumber" onChange={update("kkNumber")} required type="text" value={form.kkNumber} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="nik">No. Induk Kependudukan (NIK)</label>
            <input className="form-control" id="nik" onChange={update("nik")} required type="text" value={form.nik} />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="previousSchool">Nama Sekolah Asal SMP</label>
            <input className="form-control" id="previousSchool" onChange={update("previousSchool")} required type="text" value={form.previousSchool} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="birthPlace">Tempat Lahir</label>
            <input className="form-control" id="birthPlace" onChange={update("birthPlace")} placeholder="Contoh: Surabaya" required type="text" value={form.birthPlace} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="birthDate">Tanggal Lahir</label>
            <input className="form-control" id="birthDate" onChange={update("birthDate")} required type="date" value={form.birthDate} />
          </div>

          <div className="col-md-4">
            <label className="form-label" htmlFor="religion">Agama</label>
            <input className="form-control" id="religion" onChange={update("religion")} required type="text" value={form.religion} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="livingArrangement">Jenis Tinggal</label>
            <select className="form-select" id="livingArrangement" onChange={update("livingArrangement")} required value={form.livingArrangement}>
              <option value="">Pilih</option>
              {LIVING_ARRANGEMENT_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="transportation">Alat Transportasi ke Sekolah</label>
            <select className="form-select" id="transportation" onChange={update("transportation")} required value={form.transportation}>
              <option value="">Pilih</option>
              {TRANSPORTATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="address">Alamat Tempat Tinggal</label>
            <textarea className="form-control" id="address" onChange={update("address")} required rows={2} value={form.address} />
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="rtRw">RT/RW</label>
            <input className="form-control" id="rtRw" onChange={update("rtRw")} placeholder="001/002" required type="text" value={form.rtRw} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="dusun">Dusun</label>
            <input className="form-control" id="dusun" onChange={update("dusun")} required type="text" value={form.dusun} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="village">Kelurahan / Desa</label>
            <input className="form-control" id="village" onChange={update("village")} required type="text" value={form.village} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="district">Kecamatan</label>
            <input className="form-control" id="district" onChange={update("district")} required type="text" value={form.district} />
          </div>

          <div className="col-md-4">
            <label className="form-label" htmlFor="regency">Kabupaten / Kota</label>
            <input className="form-control" id="regency" onChange={update("regency")} required type="text" value={form.regency} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="province">Propinsi</label>
            <input className="form-control" id="province" onChange={update("province")} required type="text" value={form.province} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="postalCode">Kode Pos</label>
            <input className="form-control" id="postalCode" onChange={update("postalCode")} required type="text" value={form.postalCode} />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="phone">Nomor HP</label>
            <input className="form-control" id="phone" onChange={update("phone")} required type="tel" value={form.phone} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="email">Alamat Email</label>
            <input className="form-control" id="email" onChange={update("email")} required type="email" value={form.email} />
          </div>

          <div className="col-md-4">
            <label className="form-label" htmlFor="hobby">Hobi</label>
            <input className="form-control" id="hobby" onChange={update("hobby")} required type="text" value={form.hobby} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="ambition">Cita-Cita</label>
            <input className="form-control" id="ambition" onChange={update("ambition")} required type="text" value={form.ambition} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="majorId">Pilihan Jurusan</label>
            <select className="form-select" id="majorId" onChange={update("majorId")} required value={form.majorId}>
              <option value="">Pilih Jurusan</option>
              {majors.map((major) => (
                <option key={major.id} value={major.id}>{major.name} ({major.abbreviation})</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Sesi 2 - Data Ayah Kandung */}
      <fieldset className={step === 2 ? "" : "d-none"} ref={(el) => { stepRefs.current[1] = el; }}>
        <legend className="ppdb-session-title">Sesi 2: Data Ayah Kandung</legend>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="fatherName">Nama Ayah</label>
            <input className="form-control" id="fatherName" onChange={update("fatherName")} required type="text" value={form.fatherName} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fatherNik">NIK Ayah</label>
            <input className="form-control" id="fatherNik" onChange={update("fatherNik")} required type="text" value={form.fatherNik} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="fatherBirthYear">Tahun Lahir Ayah</label>
            <input className="form-control" id="fatherBirthYear" onChange={update("fatherBirthYear")} required type="text" value={form.fatherBirthYear} />
          </div>
          <div className="col-md-9">
            <label className="form-label" htmlFor="fatherEducation">Pendidikan Ayah</label>
            <select className="form-select" id="fatherEducation" onChange={update("fatherEducation")} required value={form.fatherEducation}>
              <option value="">Pilih</option>
              {EDUCATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fatherJob">Pekerjaan Ayah</label>
            <select className="form-select" id="fatherJob" onChange={update("fatherJob")} required value={form.fatherJob}>
              <option value="">Pilih</option>
              {JOB_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fatherIncome">Penghasilan Ayah</label>
            <select className="form-select" id="fatherIncome" onChange={update("fatherIncome")} required value={form.fatherIncome}>
              <option value="">Pilih</option>
              {INCOME_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Sesi 3 - Data Ibu Kandung */}
      <fieldset className={step === 3 ? "" : "d-none"} ref={(el) => { stepRefs.current[2] = el; }}>
        <legend className="ppdb-session-title">Sesi 3: Data Ibu Kandung</legend>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="motherName">Nama Ibu</label>
            <input className="form-control" id="motherName" onChange={update("motherName")} required type="text" value={form.motherName} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="motherNik">NIK Ibu</label>
            <input className="form-control" id="motherNik" onChange={update("motherNik")} required type="text" value={form.motherNik} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="motherBirthYear">Tahun Lahir Ibu</label>
            <input className="form-control" id="motherBirthYear" onChange={update("motherBirthYear")} required type="text" value={form.motherBirthYear} />
          </div>
          <div className="col-md-9">
            <label className="form-label" htmlFor="motherEducation">Pendidikan Ibu</label>
            <select className="form-select" id="motherEducation" onChange={update("motherEducation")} required value={form.motherEducation}>
              <option value="">Pilih</option>
              {EDUCATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="motherJob">Pekerjaan Ibu</label>
            <select className="form-select" id="motherJob" onChange={update("motherJob")} required value={form.motherJob}>
              <option value="">Pilih</option>
              {JOB_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="motherIncome">Penghasilan Ibu</label>
            <select className="form-select" id="motherIncome" onChange={update("motherIncome")} required value={form.motherIncome}>
              <option value="">Pilih</option>
              {INCOME_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Sesi 4 - Data Wali (opsional) */}
      <fieldset className={step === 4 ? "" : "d-none"} ref={(el) => { stepRefs.current[3] = el; }}>
        <legend className="ppdb-session-title">Sesi 4: Data Wali</legend>
        <p className="text-muted-strong small mb-3">Isi bagian ini hanya jika peserta didik tinggal bersama wali (bukan orang tua kandung). Kalau tidak, boleh dikosongkan.</p>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="guardianName">Nama Wali</label>
            <input className="form-control" id="guardianName" onChange={update("guardianName")} type="text" value={form.guardianName} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="guardianNik">NIK Wali</label>
            <input className="form-control" id="guardianNik" onChange={update("guardianNik")} type="text" value={form.guardianNik} />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="guardianBirthYear">Tahun Lahir Wali</label>
            <input className="form-control" id="guardianBirthYear" onChange={update("guardianBirthYear")} type="text" value={form.guardianBirthYear} />
          </div>
          <div className="col-md-9">
            <label className="form-label" htmlFor="guardianEducation">Pendidikan Wali</label>
            <select className="form-select" id="guardianEducation" onChange={update("guardianEducation")} value={form.guardianEducation}>
              <option value="">Pilih</option>
              {EDUCATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="guardianJob">Pekerjaan Wali</label>
            <select className="form-select" id="guardianJob" onChange={update("guardianJob")} value={form.guardianJob}>
              <option value="">Pilih</option>
              {JOB_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="guardianIncome">Penghasilan Wali</label>
            <select className="form-select" id="guardianIncome" onChange={update("guardianIncome")} value={form.guardianIncome}>
              <option value="">Pilih</option>
              {INCOME_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-secondary" disabled={step === 1} onClick={() => goToStep(step - 1)} type="button">
          <i aria-hidden="true" className="bi bi-arrow-left" /> Sebelumnya
        </button>

        {step < TOTAL_STEPS ? (
          <button className="btn btn-primary" onClick={() => goToStep(step + 1)} type="button">
            Selanjutnya <i aria-hidden="true" className="bi bi-arrow-right" />
          </button>
        ) : (
          <button className="btn btn-primary ppdb-submit" disabled={saving} type="submit">
            <i aria-hidden="true" className="bi bi-send-check" /> {saving ? "Mengirim..." : "Kirim Pendaftaran"}
          </button>
        )}
      </div>

      {saveError && (
        <p className="ppdb-form-note ppdb-form-error">
          <i aria-hidden="true" className="bi bi-exclamation-triangle" /> Data gagal tersimpan ke database sekolah. Coba kirim ulang, atau hubungi panitia PPDB kalau terus gagal.
        </p>
      )}

      {sheetError && (
        <p className="ppdb-form-note ppdb-form-error">
          <i aria-hidden="true" className="bi bi-exclamation-triangle" /> Data gagal terkirim ke Google Sheets. Data kamu tetap aman tersimpan di database sekolah kok, jangan khawatir.
        </p>
      )}

      {submitted && !saveError && !sheetError && (
        <p className="ppdb-form-note">
          <i aria-hidden="true" className="bi bi-check-circle" /> Pendaftaran berhasil dikirim. Terima kasih, panitia PPDB akan memproses data kamu.
        </p>
      )}
    </form>
  );
}
