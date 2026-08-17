"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAdminUser } from "@/app/admin/users/actions";

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
    const confirmed = window.confirm(`Hapus akun admin "${itemLabel}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!confirmed) return;

    setDeleting(true);
    const result = await deleteAdminUser({ id });
    setDeleting(false);

    if (result.error) {
      window.alert(`Gagal menghapus: ${result.error}`);
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
