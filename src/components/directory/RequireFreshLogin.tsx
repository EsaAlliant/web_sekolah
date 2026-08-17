"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Session Supabase (cookie) bisa aja masih teknisnya valid meski tab/
// browser sempat ditutup. Komponen ini maksa tetap wajib login ulang
// setiap buka tab/browser baru, dengan cek penanda sessionStorage
// (di-set di LoginForm setelah login berhasil) yang otomatis hilang
// begitu tab ditutup — beda dari cookie yang tetap ada.
export function RequireFreshLogin() {
  const router = useRouter();

  useEffect(() => {
    const isActiveThisTab = window.sessionStorage.getItem("admin_session_active") === "1";
    if (isActiveThisTab) return;

    const forceRelogin = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      document.cookie = "admin_login_at=; path=/; max-age=0";
      router.push("/auth/login");
      router.refresh();
    };

    forceRelogin();
  }, [router]);

  return null;
}
