"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { WebsiteSettings, SocialLink } from "@/types/settings";
import type { FooterLink } from "@/types/footer";

interface SocialLinkRow extends SocialLink { id: string; }
interface FooterLinkRow extends FooterLink { id: string; }
interface TickerItemRow { id: string; message: string; }

let tempIdCounter = 0;
function createTempId() {
  tempIdCounter += 1;
  return `new-${Date.now()}-${tempIdCounter}`;
}

export function SiteSettingsForm({ settings, socialLinks, footerLinks, tickerItems }: { settings: WebsiteSettings; socialLinks: SocialLinkRow[]; footerLinks: FooterLinkRow[]; tickerItems: TickerItemRow[] }) {
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
  const [footerLinksTitle, setFooterLinksTitle] = useState(settings.footerLinksTitle);
  const [footerLinkItems, setFooterLinkItems] = useState(footerLinks);
  const originalFooterLinkIds = footerLinks.map((link) => link.id);
  const [tickerMessages, setTickerMessages] = useState(tickerItems);
  const originalTickerIds = tickerItems.map((item) => item.id);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLinkHref = (id: string, href: string) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, href } : link)));
  };

  const updateFooterLink = (id: string, field: "label" | "href", value: string) => {
    setFooterLinkItems(footerLinkItems.map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  };

  const addFooterLink = () => {
    setFooterLinkItems([...footerLinkItems, { id: createTempId(), label: "", href: "" }]);
  };

  const removeFooterLink = (id: string) => {
    setFooterLinkItems(footerLinkItems.filter((link) => link.id !== id));
  };

  const updateTickerMessage = (id: string, message: string) => {
    setTickerMessages(tickerMessages.map((item) => (item.id === id ? { ...item, message } : item)));
  };

  const addTickerMessage = () => {
    setTickerMessages([...tickerMessages, { id: createTempId(), message: "" }]);
  };

  const removeTickerMessage = (id: string) => {
    setTickerMessages(tickerMessages.filter((item) => item.id !== id));
  };

  const moveTickerMessage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= tickerMessages.length) return;
    const next = [...tickerMessages];
    [next[index], next[target]] = [next[target], next[index]];
    setTickerMessages(next);
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
      footer_links_title: footerLinksTitle,
    }).eq("id", 1);

    const linkErrors = await Promise.all(
      links.map((link) => supabase.from("social_links").update({ href: link.href }).eq("id", link.id)),
    );

    const removedFooterLinkIds = originalFooterLinkIds.filter(
      (id) => !footerLinkItems.some((link) => link.id === id),
    );
    await Promise.all(removedFooterLinkIds.map((id) => supabase.from("footer_links").delete().eq("id", id)));

    const footerLinkUpserts = await Promise.all(
      footerLinkItems.map((link, index) => {
        const isNew = link.id.startsWith("new-");
        return isNew
          ? supabase.from("footer_links").insert({ label: link.label, href: link.href, sort_order: index }).select().single()
          : supabase.from("footer_links").update({ label: link.label, href: link.href, sort_order: index }).eq("id", link.id).select().single();
      }),
    );

    const failedLink = linkErrors.find((result) => result.error);
    const failedFooterLink = footerLinkUpserts.find((result) => result.error);
    const saveError = settingsError || failedLink?.error || failedFooterLink?.error;
    if (saveError) { setSaving(false); setError(saveError.message); return; }

    setFooterLinkItems(
      footerLinkItems.map((link, index) => {
        const savedId = footerLinkUpserts[index].data?.id as string | undefined;
        return savedId ? { id: savedId, label: link.label, href: link.href } : link;
      }),
    );

    const removedTickerIds = originalTickerIds.filter((id) => !tickerMessages.some((item) => item.id === id));
    await Promise.all(removedTickerIds.map((id) => supabase.from("announcement_ticker").delete().eq("id", id)));

    const tickerUpserts = await Promise.all(
      tickerMessages.map((item, index) => {
        const isNew = item.id.startsWith("new-");
        return isNew
          ? supabase.from("announcement_ticker").insert({ message: item.message, sort_order: index }).select().single()
          : supabase.from("announcement_ticker").update({ message: item.message, sort_order: index }).eq("id", item.id).select().single();
      }),
    );

    const failedTicker = tickerUpserts.find((result) => result.error);
    if (failedTicker?.error) { setSaving(false); setError(failedTicker.error.message); return; }

    setTickerMessages(
      tickerMessages.map((item, index) => {
        const savedId = tickerUpserts[index].data?.id as string | undefined;
        return savedId ? { id: savedId, message: item.message } : item;
      }),
    );

    setSaving(false);
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

      <h2 className="h6 mb-3">Link Terkait (tautan di Footer)</h2>
      <div className="row g-3 mb-4">
        <div className="col-12">
          <label className="form-label" htmlFor="footerLinksTitle">Judul Bagian</label>
          <input className="form-control" id="footerLinksTitle" onChange={(event) => setFooterLinksTitle(event.target.value)} type="text" value={footerLinksTitle} />
        </div>
        {footerLinkItems.map((link) => (
          <div className="col-12 d-flex gap-2 align-items-start" key={link.id}>
            <input aria-label="Label link" className="form-control" onChange={(event) => updateFooterLink(link.id, "label", event.target.value)} placeholder="Label, mis. Info GTK" type="text" value={link.label} />
            <input aria-label="URL link" className="form-control" onChange={(event) => updateFooterLink(link.id, "href", event.target.value)} placeholder="https://..." type="text" value={link.href} />
            <button aria-label="Hapus link" className="btn btn-outline-danger flex-shrink-0" onClick={() => removeFooterLink(link.id)} type="button">
              <i aria-hidden="true" className="bi bi-trash" />
            </button>
          </div>
        ))}
        <div className="col-12">
          <button className="btn btn-sm btn-outline-secondary" onClick={addFooterLink} type="button">
            <i aria-hidden="true" className="bi bi-plus-lg me-1" />Tambah Link
          </button>
        </div>
      </div>

      <h2 className="h6 mb-3">Teks Berjalan (running text di bagian paling atas situs)</h2>
      <div className="row g-3 mb-4">
        {tickerMessages.map((item, index) => (
          <div className="col-12 d-flex gap-2 align-items-start" key={item.id}>
            <input aria-label="Isi teks berjalan" className="form-control" onChange={(event) => updateTickerMessage(item.id, event.target.value)} placeholder="mis. Penerimaan Peserta Didik Baru Tahun Ajaran 2026/2027 telah dibuka." type="text" value={item.message} />
            <div className="d-flex gap-1 flex-shrink-0">
              <button className="btn btn-outline-secondary btn-sm" disabled={index === 0} onClick={() => moveTickerMessage(index, -1)} title="Naikkan urutan" type="button">
                <i aria-hidden="true" className="bi bi-arrow-up" />
              </button>
              <button className="btn btn-outline-secondary btn-sm" disabled={index === tickerMessages.length - 1} onClick={() => moveTickerMessage(index, 1)} title="Turunkan urutan" type="button">
                <i aria-hidden="true" className="bi bi-arrow-down" />
              </button>
              <button aria-label="Hapus teks" className="btn btn-outline-danger btn-sm" onClick={() => removeTickerMessage(item.id)} type="button">
                <i aria-hidden="true" className="bi bi-trash" />
              </button>
            </div>
          </div>
        ))}
        <div className="col-12">
          <button className="btn btn-sm btn-outline-secondary" onClick={addTickerMessage} type="button">
            <i aria-hidden="true" className="bi bi-plus-lg me-1" />Tambah Teks
          </button>
          <p className="form-text mb-0">Kalau diisi lebih dari satu, teksnya bakal jalan bergantian secara berurutan.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}

      <button className="btn btn-primary" disabled={saving} type="submit">{saving ? "Menyimpan..." : "Simpan Semua Perubahan"}</button>
      {saved && <span className="text-success small ms-2"><i aria-hidden="true" className="bi bi-check-circle" /> Tersimpan</span>}
    </form>
  );
}
