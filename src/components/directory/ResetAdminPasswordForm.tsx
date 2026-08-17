"use client";

import { useState } from "react";
import { resetAdminUserPassword } from "@/app/admin/users/actions";
import { showSuccess } from "@/lib/alerts";

export function ResetAdminPasswordForm({ userId }: { userId: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSaving(true);
    const result = await resetAdminUserPassword({ id: userId, newPassword: password });
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    await showSuccess("Kata sandi berhasil diganti");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="newPassword">Kata Sandi Baru</label>
          <input autoComplete="new-password" className="form-control" id="newPassword" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="confirmNewPassword">Konfirmasi Kata Sandi Baru</label>
          <input autoComplete="new-password" className="form-control" id="confirmNewPassword" minLength={8} onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <button className="btn btn-outline-primary mt-3" disabled={saving} type="submit">
        {saving ? "Menyimpan..." : "Reset Kata Sandi"}
      </button>
    </form>
  );
}
