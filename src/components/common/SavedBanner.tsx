"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SavedBannerInner({ message = "Berhasil disimpan." }: { message?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");
  const [visible, setVisible] = useState(Boolean(saved));

  useEffect(() => {
    if (!saved) return;
    setVisible(true);

    // Bersihkan ?saved dari URL supaya notifikasi tidak muncul lagi kalau halaman di-refresh
    const params = new URLSearchParams(searchParams.toString());
    params.delete("saved");
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });

    const timer = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  if (!visible) return null;

  return (
    <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3" role="alert">
      <i aria-hidden="true" className="bi bi-check-circle-fill" />
      <span>{saved === "new" ? "Berhasil ditambahkan." : saved === "edit" ? "Perubahan berhasil disimpan." : message}</span>
    </div>
  );
}

export function SavedBanner(props: { message?: string }) {
  return (
    <Suspense fallback={null}>
      <SavedBannerInner {...props} />
    </Suspense>
  );
}
