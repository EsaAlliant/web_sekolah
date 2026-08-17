"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/directory/ImageUploader";
import { createClient } from "@/lib/supabase/client";

export function LogoSettingsForm({ currentLogoUrl }: { currentLogoUrl?: string }) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const { error } = await supabase.from("website_settings").update({ logo_url: logoUrl }).eq("id", 1);
    setSaving(false);

    if (!error) {
      setSaved(true);
      router.refresh();
    }
  };

  return (
    <div>
      <ImageUploader currentUrl={currentLogoUrl} folder="logo" label="Pilih Logo" onUploaded={setLogoUrl} />
      <button className="btn btn-primary btn-sm mt-3" disabled={saving || !logoUrl} onClick={handleSave} type="button">
        {saving ? "Menyimpan..." : "Simpan Logo"}
      </button>
      {saved && <span className="text-success small ms-2"><i aria-hidden="true" className="bi bi-check-circle" /> Tersimpan</span>}
    </div>
  );
}
