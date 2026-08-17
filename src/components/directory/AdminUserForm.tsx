"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminUser, updateAdminUser } from "@/app/admin/users/actions";
import { ROLE_LABELS, type AdminRole } from "@/lib/permissions";
import type { AdminUser } from "@/types/admin-user";

const ROLE_OPTIONS: AdminRole[] = ["super_admin", "kejur", "wakur"];

export function AdminUserForm({ initialData }: { initialData?: AdminUser }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [email, setEmail] = useState(initialData?.email ?? "");
  const [fullName, setFullName] = useState(initialData?.fullName ?? "");
  const [role, setRole] = useState<AdminRole>(initialData?.role ?? "wakur");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isEdit && password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSaving(true);

    const result = isEdit
      ? await updateAdminUser({ id: initialData!.id, email, fullName, role })
      : await createAdminUser({ email, fullName, role, password });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/users");
    router.refresh();
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="fullName">Nama Lengkap</label>
          <input className="form-control" id="fullName" onChange={(event) => setFullName(event.target.value)} required type="text" value={fullName} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="email">Email</label>
          <input autoComplete="off" className="form-control" id="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="role">Role</label>
          <select className="form-select" id="role" onChange={(event) => setRole(event.target.value as AdminRole)} value={role}>
            {ROLE_OPTIONS.map((option) => (
              <option key={option} value={option}>{ROLE_LABELS[option]}</option>
            ))}
          </select>
        </div>

        {!isEdit && (
          <>
            <div className="col-md-6">
              <label className="form-label" htmlFor="password">Kata Sandi</label>
              <input autoComplete="new-password" className="form-control" id="password" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="confirmPassword">Konfirmasi Kata Sandi</label>
              <input autoComplete="new-password" className="form-control" id="confirmPassword" minLength={8} onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} />
            </div>
          </>
        )}
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" disabled={saving} type="submit">
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Admin"}
        </button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/users")} type="button">Batal</button>
      </div>
    </form>
  );
}
