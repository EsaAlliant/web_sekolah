"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAdminUser } from "@/app/admin/users/actions";
import { confirmDelete, showError } from "@/lib/alerts";

export function DeleteAdminUserButton({ id, itemLabel, disabled }: { id: string; itemLabel: string; disabled?: boolean }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (disabled) {
    return (
      <button className="btn btn-outline-secondary btn-sm" disabled title="Nggak bisa hapus akun sendiri" type="button">
        <i aria-hidden="true" className="bi bi-trash" /> Hapus
      </button>
    );
  }

  const handleDelete = async () => {
    const confirmed = await confirmDelete(itemLabel, "Akun admin ini akan dihapus permanen dan tidak bisa login lagi.");
    if (!confirmed) return;

    setDeleting(true);
    const result = await deleteAdminUser({ id });
    setDeleting(false);

    if (result.error) {
      await showError("Gagal menghapus", result.error);
      return;
    }

    router.refresh();
  };

  return (
    <button className="btn btn-outline-danger btn-sm" disabled={deleting} onClick={handleDelete} type="button">
      <i aria-hidden="true" className="bi bi-trash" /> {deleting ? "..." : "Hapus"}
    </button>
  );
}
