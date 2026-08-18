import { NextResponse } from "next/server";

interface ConfirmationPayload {
  email: string;
  fullName: string;
  registrationType: string;
  majorName?: string;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function buildEmailHtml({ fullName, registrationType, majorName }: ConfirmationPayload) {
  const schoolName = process.env.PPDB_SCHOOL_NAME || "Sekolah";
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #16211F;">
      <h2 style="color: #0E6B64;">Pendaftaran PPDB Berhasil</h2>
      <p>Halo <strong>${fullName}</strong>,</p>
      <p>Terima kasih, pendaftaranmu di <strong>${schoolName}</strong> sudah berhasil kami terima dan tercatat.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 6px 0; color: #64748b;">Jenis Pendaftaran</td><td style="padding: 6px 0; text-align: right;"><strong>${registrationType}</strong></td></tr>
        ${majorName ? `<tr><td style="padding: 6px 0; color: #64748b;">Pilihan Jurusan</td><td style="padding: 6px 0; text-align: right;"><strong>${majorName}</strong></td></tr>` : ""}
      </table>
      <p>Simpan email ini sebagai bukti bahwa kamu sudah terdaftar. Panitia PPDB akan menghubungimu untuk info tahapan selanjutnya.</p>
      <p style="color: #64748b; font-size: .85rem;">Email ini dikirim otomatis, mohon tidak membalas ke alamat ini.</p>
    </div>
  `;
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

  if (!apiKey) {
    console.warn("PPDB confirmation email: RESEND_API_KEY belum diatur, email tidak dikirim.");
    return NextResponse.json({ ok: false, error: "Layanan email belum dikonfigurasi" }, { status: 501 });
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      body: JSON.stringify({
        from: fromAddress,
        html: buildEmailHtml(body),
        subject: "Pendaftaran PPDB kamu sudah tercatat",
        to: [body.email],
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("PPDB confirmation email gagal dikirim:", response.status, detail);
      return NextResponse.json({ ok: false, error: "Gagal mengirim email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PPDB confirmation email error:", error);
    return NextResponse.json({ ok: false, error: "Gagal mengirim email" }, { status: 500 });
  }
}
