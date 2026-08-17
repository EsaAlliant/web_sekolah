"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { showSuccess } from "@/lib/alerts";

export function ChangePasswordForm({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    // Verifikasi kata sandi lama dulu sebelum ganti — supaya kalau ada
    // sesi yang lagi aktif di device lain, tetap nggak bisa asal ganti
    // password tanpa tau password lama.
    const { error: verifyError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });

    if (verifyError) {
      setSaving(false);
      setError("Kata sandi saat ini salah.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    await showSuccess("Kata sandi berhasil diganti");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="currentPassword">Kata Sandi Saat Ini</label>
          <input autoComplete="current-password" className="form-control" id="currentPassword" onChange={(event) => setCurrentPassword(event.target.value)} required type="password" value={currentPassword} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="newPassword">Kata Sandi Baru</label>
          <input autoComplete="new-password" className="form-control" id="newPassword" minLength={8} onChange={(event) => setNewPassword(event.target.value)} required type="password" value={newPassword} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</label>
          <input autoComplete="new-password" className="form-control" id="confirmPassword" minLength={8} onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} />
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mt-3" role="alert">{error}</div>}

      <button className="btn btn-primary mt-3" disabled={saving} type="submit">
        {saving ? "Menyimpan..." : "Simpan Kata Sandi"}
      </button>
    </form>
  );
}
