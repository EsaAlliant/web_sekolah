"use client";

import { useState } from "react";
import { PpdbForm } from "@/components/directory/PpdbForm";
import type { Major } from "@/types/academic";
import type { PpdbInfo } from "@/types/ppdb";

export function PpdbRegistrationGate({
  majors,
  sheetWebhookUrl,
  status,
}: {
  majors: Major[];
  sheetWebhookUrl: string;
  status: PpdbInfo["status"];
}) {
  const [revealed, setRevealed] = useState(false);

  if (status === "draft") {
    return (
      <div className="ppdb-status-bar ppdb-status-message flex-column py-5">
        <i aria-hidden="true" className="bi bi-hourglass-split fs-1 text-muted-strong mb-2" />
        <h3 className="h5 mb-1">Maaf, pendaftaran belum dibuka</h3>
        <p className="text-muted-strong mb-0">
          Pantau terus halaman ini — form pendaftaran akan aktif begitu periode PPDB resmi dimulai.
        </p>
      </div>
    );
  }

  if (status === "closed") {
    return (
      <div className="ppdb-status-bar ppdb-status-message flex-column py-5">
        <i aria-hidden="true" className="bi bi-lock fs-1 text-muted-strong mb-2" />
        <h3 className="h5 mb-1">Pendaftaran sudah ditutup</h3>
        <p className="text-muted-strong mb-0">
          Periode pendaftaran untuk tahun ajaran ini sudah berakhir. Ada pertanyaan? Hubungi kami lewat halaman Kontak.
        </p>
      </div>
    );
  }

  if (!revealed) {
    return (
      <div className="text-center py-4">
        <button className="btn btn-primary btn-lg" onClick={() => setRevealed(true)} type="button">
          <i aria-hidden="true" className="bi bi-pencil-square me-2" />Isi Form Pendaftaran
        </button>
      </div>
    );
  }

  return <PpdbForm majors={majors} sheetWebhookUrl={sheetWebhookUrl} />;
}
