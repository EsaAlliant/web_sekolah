"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError(signInError.message === "Invalid login credentials" ? "Email atau kata sandi salah." : signInError.message);
      return;
    }

    // Dicatat buat batas sesi absolut (lihat lib/supabase/middleware.ts) —
    // walau tab ditutup dan cookie Supabase masih valid, user tetap wajib
    // login ulang setelah 24 jam sejak login terakhir.
    document.cookie = `admin_login_at=${Date.now()}; path=/; max-age=${60 * 60 * 24}`;

    // Penanda per-tab (sessionStorage, BUKAN localStorage/cookie) — hilang
    // otomatis begitu tab/browser ditutup. Dicek ulang di RequireFreshLogin
    // supaya buka tab baru (walau cookie Supabase masih valid) tetap wajib
    // login ulang, bukan otomatis nyantol ke sesi lama.
    window.sessionStorage.setItem("admin_session_active", "1");

    router.push("/admin");
    router.refresh();
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label" htmlFor="email">Email</label>
        <input autoComplete="email" className="form-control" id="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="password">Kata Sandi</label>
        <input autoComplete="current-password" className="form-control" id="password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
      </div>

      {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}

      <button className="btn btn-primary w-100" disabled={loading} type="submit">
        {loading ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
