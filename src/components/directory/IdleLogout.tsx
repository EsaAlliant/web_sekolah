"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 menit tanpa aktivitas
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

// Memantau aktivitas mouse/keyboard di halaman admin. Kalau tidak ada
// aktivitas sama sekali selama IDLE_TIMEOUT_MS, otomatis logout dan
// lempar ke halaman login, sebagai lapisan keamanan tambahan.
export function IdleLogout() {
  const router = useRouter();
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    const logout = async () => {
      await supabase.auth.signOut();
      document.cookie = "admin_login_at=; path=/; max-age=0";
      router.push("/auth/login?reason=idle");
      router.refresh();
    };

    const resetTimer = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(logout, IDLE_TIMEOUT_MS);
    };

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [router]);

  return null;
}
