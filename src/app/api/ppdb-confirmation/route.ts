import { NextResponse } from "next/server";
import { getWebsiteSettings } from "@/services/settings.service";
import type { WebsiteSettings } from "@/types/settings";

interface ConfirmationPayload {
  email: string;
  fullName: string;
  registrationType: string;
  majorName?: string;
  phone?: string;
  registrationId?: string;
  submittedAt?: string;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Kode pendek yang gampang disebutin/dicatat manual, dibikin dari id baris
// (uuid) + tanggal submit — bukan primary key aslinya, cuma buat referensi
// visual di email. Kalau id-nya nggak ada (mis. insert gagal balikin data),
// kode ini di-skip aja di email, nggak bikin error.
function buildRegistrationCode(registrationId?: string, submittedAt?: string) {
  if (!registrationId) return null;
  const date = submittedAt ? new Date(submittedAt) : new Date();
  const dateCode = Number.isNaN(date.getTime())
    ? ""
    : `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const shortId = registrationId.replace(/-/g, "").slice(-6).toUpperCase();
  return `PPDB-${dateCode}-${shortId}`;
}

function emailShell(bodyContent: string, settings: WebsiteSettings) {
  return `
    <div style="background: #f1f5f9; padding: 32px 16px; font-family: 'Segoe UI', Arial, Helvetica, sans-serif;">
      <table role="presentation" style="max-width: 520px; width: 100%; margin: 0 auto; border-collapse: collapse; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 18px rgba(15,23,42,.08);">
        <tr>
          <td style="background: linear-gradient(135deg, #0E6B64, #14867D); padding: 28px 32px;">
            <p style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800;">${settings.name}</p>
            ${settings.motto ? `<p style="margin: 4px 0 0; color: #d7f3ef; font-size: 13px;">${settings.motto}</p>` : ""}
          </td>
        </tr>
        <tr>
          <td style="padding: 32px;">
            ${bodyContent}
          </td>
        </tr>
        <tr>
          <td style="background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 6px; color: #475569; font-size: 13px; font-weight: 700;">${settings.name}</p>
            ${settings.address ? `<p style="margin: 0 0 2px; color: #64748b; font-size: 12.5px;">${settings.address}</p>` : ""}
            <p style="margin: 8px 0 0; color: #64748b; font-size: 12.5px;">
              ${settings.phone ? `Telp: ${settings.phone}` : ""}${settings.phone && settings.email ? " · " : ""}${settings.email ? settings.email : ""}
            </p>
            ${settings.whatsappUrl ? `<p style="margin: 12px 0 0;"><a href="${settings.whatsappUrl}" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; font-size: 12.5px; font-weight: 700; padding: 8px 16px; border-radius: 999px;">Chat via WhatsApp</a></p>` : ""}
            <p style="margin: 14px 0 0; color: #94a3b8; font-size: 11.5px;">Email ini dikirim otomatis, mohon tidak membalas ke alamat ini.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function summaryRow(label: string, value: string) {
  return `<tr><td style="padding: 9px 0; color: #64748b; font-size: 13.5px; border-bottom: 1px solid #f1f5f9;">${label}</td><td style="padding: 9px 0; text-align: right; color: #16211F; font-size: 13.5px; font-weight: 700; border-bottom: 1px solid #f1f5f9;">${value}</td></tr>`;
}

function buildParticipantEmailHtml(payload: ConfirmationPayload, settings: WebsiteSettings) {
  const { fullName, registrationType, majorName, registrationId, submittedAt } = payload;
  const code = buildRegistrationCode(registrationId, submittedAt);

  const body = `
    <h1 style="margin: 0 0 4px; color: #0E6B64; font-size: 21px;">Pendaftaran Kamu Berhasil 🎉</h1>
    <p style="margin: 0 0 18px; color: #16211F; font-size: 14.5px; line-height: 1.6;">
      Halo <strong>${fullName}</strong>, terima kasih sudah mendaftar di <strong>${settings.name}</strong>.
      Data kamu sudah kami terima dan tercatat di sistem PPDB.
    </p>
    ${code ? `
    <div style="background: #ecfbf9; border: 1px dashed #0E6B64; border-radius: 10px; padding: 14px 18px; margin: 0 0 20px; text-align: center;">
      <p style="margin: 0 0 4px; color: #0E6B64; font-size: 11.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;">Nomor Pendaftaran</p>
      <p style="margin: 0; color: #0E6B64; font-size: 19px; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: .05em;">${code}</p>
    </div>` : ""}
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 22px;">
      ${summaryRow("Jenis Pendaftaran", registrationType)}
      ${majorName ? summaryRow("Pilihan Jurusan", majorName) : ""}
    </table>
    <p style="margin: 0 0 8px; color: #16211F; font-size: 14px; font-weight: 700;">Langkah selanjutnya</p>
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 4px;">
      <tr><td style="padding: 4px 0; color: #16211F; font-size: 13.5px; line-height: 1.6; vertical-align: top; width: 22px;">1.</td><td style="padding: 4px 0; color: #16211F; font-size: 13.5px; line-height: 1.6;">Simpan email ini${code ? " dan nomor pendaftaran di atas" : ""} sebagai bukti kamu sudah terdaftar.</td></tr>
      <tr><td style="padding: 4px 0; color: #16211F; font-size: 13.5px; line-height: 1.6; vertical-align: top;">2.</td><td style="padding: 4px 0; color: #16211F; font-size: 13.5px; line-height: 1.6;">Panitia PPDB akan menghubungi kamu lewat telepon/WhatsApp untuk info tahapan & jadwal selanjutnya.</td></tr>
      <tr><td style="padding: 4px 0; color: #16211F; font-size: 13.5px; line-height: 1.6; vertical-align: top;">3.</td><td style="padding: 4px 0; color: #16211F; font-size: 13.5px; line-height: 1.6;">Pantau pengumuman resmi di website kami untuk update terbaru.</td></tr>
    </table>
  `;

  return emailShell(body, settings);
}

// Email kedua, isinya buat panitia/admin sekolah, ngasih tau ada pendaftar
// baru masuk. Konfigurasinya lewat env var PPDB_ADMIN_EMAIL — kalau nggak
// diisi, notifikasi ini otomatis nggak dikirim (fitur opsional, nggak
// ganggu jalannya email konfirmasi ke peserta).
function buildAdminEmailHtml(payload: ConfirmationPayload, settings: WebsiteSettings) {
  const { fullName, registrationType, majorName, email, phone, registrationId, submittedAt } = payload;
  const code = buildRegistrationCode(registrationId, submittedAt);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const adminLink = siteUrl ? `${siteUrl.replace(/\/$/, "")}/admin/ppdb-submissions` : null;

  const body = `
    <h1 style="margin: 0 0 4px; color: #0E6B64; font-size: 21px;">📥 Pendaftar PPDB Baru</h1>
    <p style="margin: 0 0 18px; color: #16211F; font-size: 14.5px; line-height: 1.6;">
      Ada pendaftar baru masuk lewat form PPDB di situs <strong>${settings.name}</strong>.
    </p>
    ${code ? `<p style="margin: 0 0 18px; color: #64748b; font-size: 12.5px; font-family: 'Courier New', monospace;">Ref: ${code}</p>` : ""}
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 22px;">
      ${summaryRow("Nama", fullName)}
      ${summaryRow("Email", email)}
      ${phone ? summaryRow("No. HP", phone) : ""}
      ${summaryRow("Jenis Pendaftaran", registrationType)}
      ${majorName ? summaryRow("Pilihan Jurusan", majorName) : ""}
    </table>
    <p style="margin: 0 0 18px; color: #64748b; font-size: 13px; line-height: 1.6;">
      Data lengkap (KK, NIK, alamat, data orang tua/wali) sudah tersimpan di panel admin.
    </p>
    ${adminLink
      ? `<p style="margin: 0;"><a href="${adminLink}" style="display: inline-block; background: #0E6B64; color: #ffffff; text-decoration: none; font-size: 13.5px; font-weight: 700; padding: 10px 20px; border-radius: 8px;">Buka Data Pendaftar PPDB →</a></p>`
      : `<p style="margin: 0; color: #64748b; font-size: 13px;">Buka menu <strong>Pendaftar PPDB</strong> di panel admin untuk lihat detail lengkap.</p>`}
  `;

  return emailShell(body, settings);
}

export async function POST(request: Request) {
  let body: ConfirmationPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body tidak valid" }, { status: 400 });
  }

  if (!body.email || !body.fullName) {
    return NextResponse.json({ ok: false, error: "email dan fullName wajib diisi" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.PPDB_EMAIL_FROM || "onboarding@resend.dev";
  const adminEmails = (process.env.PPDB_ADMIN_EMAIL || "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (!apiKey) {
    console.warn("PPDB confirmation email: RESEND_API_KEY belum diatur, email tidak dikirim.");
    return NextResponse.json({ ok: false, error: "Layanan email belum dikonfigurasi" }, { status: 501 });
  }

  const settings = await getWebsiteSettings();

  const sendEmail = (to: string[], subject: string, html: string) =>
    fetch(RESEND_ENDPOINT, {
      body: JSON.stringify({ from: fromAddress, html, subject, to }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

  try {
    const participantResponse = await sendEmail(
      [body.email],
      "Pendaftaran PPDB kamu sudah tercatat",
      buildParticipantEmailHtml(body, settings),
    );

    if (!participantResponse.ok) {
      const detail = await participantResponse.text();
      console.error("PPDB confirmation email gagal dikirim:", participantResponse.status, detail);
      return NextResponse.json({ ok: false, error: "Gagal mengirim email" }, { status: 502 });
    }

    // Notifikasi ke sekolah bersifat best-effort dan terpisah dari email
    // konfirmasi ke peserta: kalau PPDB_ADMIN_EMAIL belum diisi, atau
    // pengirimannya gagal, pendaftaran tetap dianggap sukses karena email
    // ke peserta (di atas) sudah berhasil.
    if (adminEmails.length > 0) {
      try {
        const adminResponse = await sendEmail(
          adminEmails,
          `Pendaftar PPDB baru: ${body.fullName}`,
          buildAdminEmailHtml(body, settings),
        );
        if (!adminResponse.ok) {
          const detail = await adminResponse.text();
          console.error("PPDB admin notification gagal dikirim:", adminResponse.status, detail);
        }
      } catch (adminError) {
        console.error("PPDB admin notification error:", adminError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PPDB confirmation email error:", error);
    return NextResponse.json({ ok: false, error: "Gagal mengirim email" }, { status: 500 });
  }
}
