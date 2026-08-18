"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PpdbSubmissionRow } from "@/types/database";

const STATUS_LABELS: Record<PpdbSubmissionRow["status"], string> = {
  baru: "Baru",
  diverifikasi: "Diverifikasi",
  diterima: "Diterima",
  ditolak: "Ditolak",
};

export function PpdbStatusSelect({ id, status }: { id: string; status: PpdbSubmissionRow["status"] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("ppdb_submissions").update({ status: event.target.value }).eq("id", id);
    setSaving(false);
    router.refresh();
  };

  return (
    <select className={`form-select form-select-sm ppdb-status-select status-${status}`} disabled={saving} onChange={handleChange} value={status}>
      {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </select>
  );
}