"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Mencatat satu baris ke tabel page_visits setiap pathname berubah.
// Sengaja jalan di client (bukan middleware), supaya prefetch link
// Next.js (hover, dsb) tidak ikut kehitung sebagai kunjungan.
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("page_visits")
      .insert({ path: pathname })
      .then(({ error }) => {
        if (error) console.error("Gagal mencatat kunjungan:", error.message);
      });
  }, [pathname]);

  return null;
}
