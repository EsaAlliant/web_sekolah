import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/directory/LoginForm";
import { createServerClient } from "@/lib/supabase/server";
import { getWebsiteSettings } from "@/services/settings.service";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  const { reason } = await searchParams;
  const settings = await getWebsiteSettings();

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <Link className="login-back-link" href="/">
          <i aria-hidden="true" className="bi bi-arrow-left" /> Kembali ke Beranda
        </Link>
        <div className="login-card">
          <div className="login-logo">{settings.logoText}</div>
          <h1 className="h5 mb-1 text-center">Masuk Admin</h1>
          <p className="text-muted-strong text-center mb-4">{settings.name}</p>
          {reason === "idle" && (
            <div className="alert alert-warning py-2 small mb-3" role="alert">
              <i aria-hidden="true" className="bi bi-clock-history" /> Sesi kamu berakhir karena tidak ada aktivitas. Silakan masuk kembali.
            </div>
          )}
          {reason === "expired" && (
            <div className="alert alert-warning py-2 small mb-3" role="alert">
              <i aria-hidden="true" className="bi bi-calendar-x" /> Sesi kamu sudah lebih dari 24 jam. Silakan masuk kembali.
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
