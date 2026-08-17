"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "admin_login_at=; path=/; max-age=0";
    window.sessionStorage.removeItem("admin_session_active");
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button className="btn btn-outline-secondary btn-sm" disabled={loading} onClick={handleLogout} type="button">
      <i aria-hidden="true" className="bi bi-box-arrow-right" /> {loading ? "Keluar..." : "Keluar"}
    </button>
  );
}
