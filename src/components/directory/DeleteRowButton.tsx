"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteRowButton({ table, id, itemLabel }: { table: string; id: string; itemLabel: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [justDeleted, setJustDeleted] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Hapus "${itemLabel}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    setDeleting(false);

    if (error) {
      window.alert(`Gagal menghapus: ${error.message}`);
      return;
    }

    setJustDeleted(true);
    router.refresh();
  };

  if (justDeleted) {
    return <span className="text-success small"><i aria-hidden="true" className="bi bi-check-circle-fill" /> Terhapus</span>;
  }

  return (
    <button className="btn btn-outline-danger btn-sm" disabled={deleting} onClick={handleDelete} type="button">
      <i aria-hidden="true" className="bi bi-trash" /> {deleting ? "..." : "Hapus"}
    </button>
  );
}
