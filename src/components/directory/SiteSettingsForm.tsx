"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { WebsiteSettings, SocialLink } from "@/types/settings";

interface SocialLinkRow extends SocialLink { id: string; }

export function SiteSettingsForm({ settings, socialLinks }: { settings: WebsiteSettings; socialLinks: SocialLinkRow[] }) {
  const router = useRouter();

  const [name, setName] = useState(settings.name);
  const [shortName, setShortName] = useState(settings.shortName);
  const [description, setDescription] = useState(settings.description);
  const [motto, setMotto] = useState(settings.motto);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [whatsappUrl, setWhatsappUrl] = useState(settings.whatsappUrl);
  const [ppdbSheetWebhookUrl, setPpdbSheetWebhookUrl] = useState(settings.ppdbSheetWebhookUrl);
  const [officeHours, setOfficeHours] = useState(settings.officeHours);
  const [accreditation, setAccreditation] = useState(settings.accreditation);
  const [foundedYear, setFoundedYear] = useState(settings.foundedYear);
  const [links, setLinks] = useState(socialLinks);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLinkHref = (id: string, href: string) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, href } : link)));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();

    const { error: settingsError } = await supabase.from("website_settings").update({
      name,
      short_name: shortName,
      description,
      motto,
      address,
      phone,
      email,
      whatsapp_url: whatsappUrl,
      ppdb_sheet_webhook_url: ppdbSheetWebhookUrl,
      office_hours: officeHours,
      accreditation,
      founded_year: foundedYear,
    }).eq("id", 1);

    const linkErrors = await Promise.all(
      links.map((link) => supabase.from("social_links").update({ href: link.href }).eq("id", link.id)),
    );

    setSaving(false);
    const failedLink = linkErrors.find((result) => result.error);
    const saveError = settingsError || failedLink?.error;
    if (saveError) { setError(saveError.message); return; }

    setSaved(true);
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <h2 className="h6 mb-3">Identitas Sekolah</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label" htmlFor="name">Nama Lengkap Sekolah</label>
          <input className="form-control" id="name" onChange={(event) => setName(event.target.value)} required type="text" value={name} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="shortName">Nama Pendek</label>
          <input className="form-control" id="shortName" onChange={(event) => setShortName(event.target.value)} required type="text" value={shortName} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="motto">Motto</label>
          <input className="form-control" id="motto" onChange={(event) => setMotto(event.target.value)} type="text" value={motto} />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="accreditation">Akreditasi</label>
          <input className="form-control" id="accreditation" onChange={(event) => setAccreditation(event.target.value)} placeholder="A (Unggul)" type="text" value={accreditation} />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="foundedYear">Berdiri Sejak</label>
          <input className="form-control" id="foundedYear" onChange={(event) => setFoundedYear(event.target.value)} placeholder="1998" type="text" value={foundedYear} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="description">Deskripsi Singkat</label>
          <textarea className="form-control" id="description" onChange={(event) => setDescription(event.target.value)} rows={2} value={description} />
        </div>
      </div>

      <h2 className="h6 mb-3">Kontak</h2>
      <div className="row g-3 mb-4">
        <div className="col-12">
          <label className="form-label" htmlFor="address">Alamat</label>
          <textarea className="form-control" id="address" onChange={(event) => setAddress(event.target.value)} rows={2} value={address} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="phone">Telepon</label>
          <input className="form-control" id="phone" onChange={(event) => setPhone(event.target.value)} type="text" value={phone} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="email">Email</label>
          <input className="form-control" id="email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="officeHours">Jam Layanan</label>
          <input className="form-control" id="officeHours" onChange={(event) => setOfficeHours(event.target.value)} type="text" value={officeHours} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="whatsappUrl">Link WhatsApp (buat form Kontak)</label>
          <input className="form-control" id="whatsappUrl" onChange={(event) => setWhatsappUrl(event.target.value)} placeholder="https://wa.me/62..." type="text" value={whatsappUrl} />
        </div>
      </div>

      <h2 className="h6 mb-3">Integrasi PPDB (Google Sheets)</h2>
      <div className="row g-3 mb-4">
        <div className="col-12">
          <label className="form-label" htmlFor="ppdbSheetWebhookUrl">URL Web App Google Apps Script</label>
          <input className="form-control" id="ppdbSheetWebhookUrl" onChange={(event) => setPpdbSheetWebhookUrl(event.target.value)} placeholder="https://script.google.com/macros/s/xxxxx/exec" type="text" value={ppdbSheetWebhookUrl} />
          <p className="form-text">Setiap pendaftar PPDB baru otomatis dikirim ke Google Sheet lewat URL ini. Lihat panduan setup di file <code>ppdb-sheets-setup.md</code>.</p>
        </div>
      </div>

      <h2 className="h6 mb-3">Media Sosial (tautan di Footer)</h2>
      <div className="row g-3 mb-4">
        {links.map((link) => (
          <div className="col-md-6" key={link.id}>
            <label className="form-label"><i aria-hidden="true" className={`bi ${link.icon} me-1`} /> {link.label}</label>
            <input className="form-control" onChange={(event) => updateLinkHref(link.id, event.target.value)} placeholder="https://..." type="text" value={link.href} />
          </div>
        ))}
      </div>

      {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}

      <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : "Simpan Semua Perubahan"}</button>
      {saved && <span className="text-success small ms-2"><i aria-hidden="true" className="bi bi-check-circle" /> Tersimpan</span>}
    </form>
  );
}
